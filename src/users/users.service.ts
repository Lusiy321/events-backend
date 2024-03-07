/* eslint-disable prettier/prettier */
import { Inject, Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserSchema } from './users.model';
import { CreateUserDto } from './dto/create.user.dto';
import { compareSync, hashSync } from 'bcryptjs';
import {
  Conflict,
  NotFound,
  BadRequest,
  Unauthorized,
  NotAcceptable,
} from 'http-errors';
import { UpdateUserDto } from './dto/update.user.dto';
import { sign, verify, JwtPayload } from 'jsonwebtoken';
import { PasswordChangeDto } from './dto/change-password.user.dto';
import { MailUserDto } from './dto/email.user.dto';
import { GoogleUserDto } from './dto/google.user.dto';
import { Category } from './category.model';
import { Categories } from './dto/caterory.interface';
import { verifyEmailMsg } from './utils/emails/email.schemas';
import { rows } from './utils/parse.user';
import * as nodemailer from 'nodemailer';
import { LoginUserDto } from './dto/login.user.dto';
import { PasswordUserDto } from './dto/password.user.dto';
import { changePasswordEmailMsg } from './utils/emails/email.changePassword';
import { restorePasswordEmailMsg } from './utils/emails/email.restorePassword';
export const TRANSPORTER_PROVIDER = 'TRANSPORTER_PROVIDER';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: User,
    @InjectModel(Category.name) private categoryModel: Category,
    @Inject(TRANSPORTER_PROVIDER)
    private transporter: nodemailer.Transporter,
  ) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.zoho.eu',
      port: 465,
      secure: true,
      auth: {
        user: process.env.NOREPLY_MAIL,
        pass: process.env.NOREPLY_PASSWORD,
      },
    });
  }
  // USER

  async findAllUsers(): Promise<User[]> {
    try {
      const find = await this.userModel.find().select(rows);
      return find;
    } catch (e) {
      throw new NotFound('User not found');
    }
  }

  async findById(id: string): Promise<User> {
    try {
      const find = await this.userModel.findById(id).select('-password').exec();
      await this.checkTrialStatus(id);
      return find;
    } catch (e) {
      throw new NotFound('User not found');
    }
  }

  async create(user: CreateUserDto): Promise<User> {
    try {
      const { email, password, phone, firstName } = user;
      if (email && password && phone && firstName) {
        const lowerCaseEmail = email.toLowerCase();

        const registrationUser = await this.userModel.findOne({
          email: lowerCaseEmail,
        });
        if (registrationUser) {
          throw new Conflict(`User with ${email} in use`);
        }
        const trialEnds = new Date();
        trialEnds.setMonth(trialEnds.getMonth() + 2);

        const createdUser = await this.userModel.create({
          ...user,
          trial: true,
          trialEnds,
          paidEnds: trialEnds,
        });
        createdUser.setPassword(password);
        createdUser.save();
        await this.createToken(createdUser);
        await this.sendVerificationEmail(email);
        return await this.userModel
          .findById(createdUser._id)
          .select(rows)
          .exec();
      } else {
        throw new BadRequest('Missing parameters');
      }
    } catch (e) {
      throw e;
    }
  }

  async checkTrialStatus(id: string): Promise<boolean> {
    try {
      const user = await this.userModel.findById(id).select('-password').exec();
      if (!user) {
        throw new NotFound('User not found');
      }
      if (user.trial && user.trialEnds > new Date()) {
        return true;
      } else {
        user.trial = false;
        await user.save();
        return false;
      }
    } catch (e) {
      throw e;
    }
  }

  async sendVerificationEmail(email: string): Promise<void> {
    try {
      const user = await this.userModel.findOne({ email: email });

      const body = await verifyEmailMsg(user.id);
      const msg = {
        from: process.env.NOREPLY_MAIL,
        to: email,
        subject: 'Wechirka.com - підтведження реєстрації',
        html: body,
      };

      await this.transporter.sendMail(msg);
      return user;
    } catch (error) {
      throw new Error('Failed to send verification email');
    }
  }

  async verifyUserEmail(id: any) {
    try {
      const user = await this.userModel.findById(id);
      if (!user) {
        throw new NotFound('User not found');
      }
      await this.userModel.findByIdAndUpdate({ _id: id }, { verify: true });
      return await this.userModel.findById(id);
    } catch (e) {
      throw e;
    }
  }

  async changePassword(req: any, newPass: PasswordChangeDto): Promise<User> {
    const user = await this.findToken(req);
    if (!user) {
      throw new Unauthorized('jwt expired');
    }
    try {
      const { oldPassword, password } = newPass;
      if (user.comparePassword(oldPassword) === true) {
        user.setPassword(password);
        await this.userModel.findByIdAndUpdate(
          { _id: user._id },
          { password: user.password },
        );
        const body = await changePasswordEmailMsg();
        const msg = {
          to: user.email,
          from: process.env.NOREPLY_MAIL,
          subject: 'Зміна пароля',
          html: body,
        };
        await this.transporter.sendMail(msg);
        return await this.userModel.findById(user._id).select(rows).exec();
      }
      throw new BadRequest('Password is not avaible');
    } catch (e) {
      throw e;
    }
  }

  async validateUser(details: GoogleUserDto) {
    try {
      const user = await this.userModel.findOne({ email: details.email });
      if (user) {
        if (user.googleId === details.googleId) {
          await this.checkTrialStatus(user._id);
          await this.createToken(user);
          return await this.userModel.findOne({ _id: user.id });
        }
        if (!user.googleId) {
          await this.userModel.findByIdAndUpdate(
            { _id: user.id },
            { googleId: details.googleId },
          );
          await this.checkTrialStatus(user._id);
          await this.createToken(user);
          return await this.userModel.findOne({ _id: user.id });
        }
      }

      if (!user) {
        const trialEnds = new Date();
        trialEnds.setMonth(trialEnds.getMonth() + 2);
        const createdUser = await this.userModel.create({
          ...details,
          trial: true,
          verify: true,
          trialEnds,
          paidEnds: trialEnds,
        });
        createdUser.setPassword(details.password);
        createdUser.save();
        const userUpdateToken = await this.userModel.findOne({
          email: details.email,
        });
        await this.sendVerificationEmail(details.email);
        const newUser = await this.createToken(userUpdateToken);
        return newUser;
      }
    } catch (e) {
      throw new Error('Error validating user');
    }
  }

  async validateFacebook(details: any) {
    try {
      const user = await this.userModel.findOne({
        email: details.email,
      });
      if (user) {
        if (user.facebookId === details.facebookId) {
          await this.checkTrialStatus(user._id);
          const newUser = await this.createToken(user);
          return newUser;
        }
        if (!user.facebookId) {
          await this.userModel.findByIdAndUpdate(
            { _id: user.id },
            { facebookId: details.facebookId },
          );
          await this.checkTrialStatus(user._id);
          const newUser = await this.createToken(user);
          return newUser;
        }
      }
      if (!user) {
        const trialEnds = new Date();
        trialEnds.setMonth(trialEnds.getMonth() + 2);
        const createdUser = await this.userModel.create({
          ...details,
          trial: true,
          trialEnds,
          verify: true,
          paidEnds: trialEnds,
        });
        createdUser.setPassword(details.password);
        createdUser.save();
        const userUpdateToken = await this.userModel.findOne({
          email: details.email,
        });
        await this.sendVerificationEmail(details.email);
        const newUser = await this.createToken(userUpdateToken);
        return newUser;
      }
    } catch (e) {
      throw new Error('Error validating user');
    }
  }

  async restorePassword(email: MailUserDto) {
    try {
      const restoreMail: User = await this.userModel.findOne(email);
      if (restoreMail) {
        function generatePassword() {
          const length = 8;
          const charset =
            'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+=-';
          let password = '';
          for (let i = 0, n = charset.length; i < length; ++i) {
            password += charset[Math.floor(Math.random() * n)];
          }
          return password;
        }
        const newPassword = generatePassword();
        restoreMail.setPassword(newPassword);
        await this.userModel.findByIdAndUpdate(
          { _id: restoreMail._id },
          { password: restoreMail.password },
        );
        const body = await restorePasswordEmailMsg(newPassword);
        const msg: any = {
          to: restoreMail.email,
          from: process.env.NOREPLY_MAIL,
          subject: 'Відновлення пароля на Wechirka.com',
          html: body,
        };
        return await this.transporter.sendMail(msg);
      }
    } catch (e) {
      throw new BadRequest('User not found');
    }
  }

  async login(user: LoginUserDto): Promise<User> {
    try {
      const { email, password } = user;
      const lowerCaseEmail = email.toLowerCase();
      const authUser = await this.userModel.findOne({ email: lowerCaseEmail });
      if (!authUser || !authUser.comparePassword(password)) {
        throw new Unauthorized(`Email or password is wrong`);
      }
      if (authUser.verify === false) {
        throw new NotAcceptable(`Email not verify`);
      }
      await this.checkTrialStatus(authUser._id);
      await this.createToken(authUser);
      return await this.userModel
        .findOne({ email: lowerCaseEmail })
        .select('-password')
        .exec();
    } catch (e) {
      throw e;
    }
  }

  async logout(req: any): Promise<User> {
    const user = await this.findToken(req);
    if (!user) {
      throw new Unauthorized('jwt expired');
    }
    try {
      await this.userModel.findByIdAndUpdate({ _id: user.id }, { token: null });
      return await this.userModel
        .findById({ _id: user.id })
        .select('-password')
        .exec();
    } catch (e) {
      throw e;
    }
  }

  async deleteUserProfile(
    req: any,
    userPassword: PasswordUserDto,
  ): Promise<User> {
    const user = await this.findToken(req);
    if (!user) {
      throw new Unauthorized('jwt expired');
    }
    try {
      const { password } = userPassword;
      if (user.comparePassword(password) === true) {
        await this.userModel.findByIdAndRemove({ _id: user._id });
        const body = delUserMsg;
        const msg = {
          to: user.email,
          from: process.env.NOREPLY_MAIL,
          subject: 'Видалення профілю',
          html: body,
        };
        return await this.transporter.sendMail(msg);
      }
      throw new BadRequest('Password is not avaible');
    } catch (e) {
      throw e;
    }
  }

  async updateUser(user: UpdateUserDto, req: any): Promise<User> {
    try {
      const {
        firstName,
        social,
        title,
        description,
        phone,
        telegram,
        whatsapp,
        location,
        master_photo,
        video,
        price,
        viber,
        register,
      } = user;
      const findId = await this.findToken(req);

      if (!findId) {
        throw new Unauthorized('jwt expired');
      }

      if (
        firstName ||
        title ||
        description ||
        phone ||
        telegram ||
        whatsapp ||
        location ||
        master_photo ||
        video ||
        price ||
        social ||
        viber ||
        register
      ) {
        if (video) {
          await this.userModel.findByIdAndUpdate(
            { _id: findId.id },
            {
              $push: { video: { $each: video, $slice: 5 } },
            },
          );
          return await this.userModel
            .findById({ _id: findId.id })
            .select(rows)
            .exec();
        }
        if (social) {
          const updatedSocial = { ...findId.social, ...social };

          const sanitizedSocial = Object.entries(updatedSocial)
            .filter(([key, value]) => key && value)
            .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

          await this.userModel.findByIdAndUpdate(
            { _id: findId.id },
            { $set: { social: sanitizedSocial } },
          );

          return await this.userModel
            .findById({ _id: findId.id })
            .select(rows)
            .exec();
        }
        await this.userModel.findByIdAndUpdate(
          { _id: findId.id },
          {
            firstName,
            title,
            description,
            phone,
            telegram,
            whatsapp,
            location,
            master_photo,
            price,
            viber,
            register,
          },
        );

        return await this.userModel
          .findById({ _id: findId.id })
          .select(rows)
          .exec();
      }
    } catch (e) {
      throw e;
    }
  }
  private async addSubcategory(
    categories: Categories[],
    newCategory: Categories,
  ): Promise<Categories[]> {
    const updatedCategories = categories.map((category) => {
      if (category._id === newCategory._id) {
        category.subcategories = [
          ...category.subcategories,
          ...newCategory.subcategories,
        ];
      }

      return category;
    });

    if (!categories.some((category) => category._id === newCategory._id)) {
      updatedCategories.push(newCategory);
    }
    return updatedCategories;
  }

  async updateCategory(data: Categories, req: any): Promise<User> {
    try {
      const newCategory = data;
      const findId = await this.findToken(req);
      if (!findId) {
        throw new Unauthorized('jwt expired');
      }
      const findUser = await this.userModel.findById(findId.id).exec();
      const arrCategory = findUser.category;
      const newCategoryArr = await this.addSubcategory(
        arrCategory,
        newCategory,
      );
      await this.userModel.updateOne(
        { _id: findId.id },
        {
          $set: { category: newCategoryArr },
        },
      );

      return await this.userModel
        .findById({ _id: findId.id })
        .select(rows)
        .exec();
    } catch (e) {
      throw e;
    }
  }

  async deleteCategory(id: string, req: any) {
    try {
      const user = await this.findToken(req);
      if (!user) {
        throw new Unauthorized('jwt expired');
      }
      const updatedCategories = user.category
        .map((category) => {
          if (category._id === id) {
            return undefined;
          } else {
            category.subcategories = category.subcategories.filter(
              (subcat) => subcat.id !== id,
            );
            return category;
          }
        })
        .filter(Boolean);

      await this.userModel.updateOne(
        { _id: user.id },
        {
          $set: { category: updatedCategories },
        },
      );
      return await this.userModel
        .findById({ _id: user.id })
        .select(rows)
        .exec();
    } catch (e) {
      throw e;
    }
  }

  async deleteUserVideo(id: string, req: any) {
    const user = await this.findToken(req);
    if (!user) {
      throw new Unauthorized('jwt expired');
    }
    try {
      const videoArray = user.video;
      const newArr = videoArray.filter((video) => video.publicId !== id);
      await this.userModel.findByIdAndUpdate(
        { _id: user.id },
        {
          $set: { video: newArr },
        },
      );
      return await this.userModel
        .findById({ _id: user.id })
        .select(rows)
        .exec();
    } catch (e) {
      throw e;
    }
  }

  // JWT TOKEN
  async findToken(req: any): Promise<User> {
    try {
      const { authorization = '' } = req.headers;
      const [bearer, token] = authorization.split(' ');
      if (bearer !== 'Bearer') {
        throw new Unauthorized('Not authorized');
      } else {
        const SECRET_KEY = process.env.SECRET_KEY;
        const findId = verify(token, SECRET_KEY) as JwtPayload;
        const user = await this.userModel.findById({ _id: findId.id }).exec();
        return user;
      }
    } catch (e) {
      if (e.message === 'jwt expired') {
        throw new Unauthorized('jwt expired');
      } else {
        throw e;
      }
    }
  }

  async createToken(authUser: { _id: string }) {
    try {
      const payload = {
        id: authUser._id,
      };
      const SECRET_KEY = process.env.SECRET_KEY;
      const token = sign(payload, SECRET_KEY, { expiresIn: '1m' });
      const refreshToken = sign(payload, SECRET_KEY);
      const authentificationUser = await this.userModel
        .findById({
          _id: authUser._id,
        })
        .select('-password')
        .exec();
      if (authentificationUser.refresh_token !== null) {
        await this.userModel.findByIdAndUpdate(authUser._id, {
          token: token,
        });
        return await this.userModel
          .findById({
            _id: authUser._id,
          })
          .select('-password')
          .exec();
      } else {
        await this.userModel.findByIdAndUpdate(authUser._id, {
          token: token,
          refresh_token: refreshToken,
        });
        return await this.userModel
          .findById({
            _id: authUser._id,
          })
          .select('-password')
          .exec();
      }
    } catch (e) {
      throw e;
    }
  }

  async refreshAccessToken(req: any): Promise<User> {
    try {
      const { authorization = '' } = req.headers;
      const [bearer, token] = authorization.split(' ');
      if (bearer !== 'Bearer') {
        throw new Unauthorized('jwt expired');
      }
      const SECRET_KEY = process.env.SECRET_KEY;
      const user = await this.userModel.findOne({
        refresh_token: token,
      });
      if (!user) {
        throw new NotFound('User not found');
      }
      const payload = {
        id: user._id,
      };
      const tokenRef = sign(payload, SECRET_KEY, { expiresIn: '24h' });
      await this.userModel.findByIdAndUpdate(user._id, { token: tokenRef });
      const authentificationUser = await this.userModel
        .findById({
          _id: user.id,
        })
        .select('-password')
        .exec();
      return authentificationUser;
    } catch (e) {
      throw e;
    }
  }
  // CATEGORY

  async findCategory(): Promise<Category[]> {
    try {
      const find = await this.categoryModel.find().exec();
      return find;
    } catch (e) {
      throw new NotFound('User not found');
    }
  }
}

UserSchema.methods.setPassword = async function (password: string) {
  return (this.password = hashSync(password, 10));
};

UserSchema.methods.setName = function (email: string) {
  const parts = email.split('@');
  this.firstName = parts[0];
};
UserSchema.methods.comparePassword = function (password: string) {
  return compareSync(password, this.password);
};
