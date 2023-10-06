/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserSchema } from './users.model';
import { CreateUserDto } from './dto/create.user.dto';
import { compareSync, hashSync } from 'bcrypt';
import { Conflict, NotFound, BadRequest, Unauthorized } from 'http-errors';
import { UpdateUserDto } from './dto/update.user.dto';
import { sign, verify, JwtPayload } from 'jsonwebtoken';
import { PasswordUserDto } from './dto/password.user.dto';
import * as sgMail from '@sendgrid/mail';
import { MailUserDto } from './dto/email.user.dto';
import { UpdatePasswordUserDto } from './dto/updatePassword.user.dto';
import { GoogleUserDto } from './dto/google.user.dto';
import { Category } from './category.model';
import { CreateCategoryDto } from './dto/create.category.dto';
import { Subcategories } from './utils/subcategory.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: User,
    @InjectModel(Category.name) private categoryModel: Category,
  ) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async findById(id: string): Promise<User> {
    try {
      const find = await this.userModel.findById(id).exec();
      return find;
    } catch (e) {
      throw new NotFound('User not found');
    }
  }

  async findCategory(): Promise<Category[]> {
    try {
      const find = await this.categoryModel.find().exec();
      return find;
    } catch (e) {
      throw new NotFound('User not found');
    }
  }

  async create(user: CreateUserDto): Promise<User> {
    try {
      const { email } = user;
      const lowerCaseEmail = email.toLowerCase();

      const registrationUser = await this.userModel.findOne({
        email: lowerCaseEmail,
      });
      if (registrationUser) {
        throw new Conflict(`User with ${email} in use`);
      }

      const createdUser = await this.userModel.create(user);
      createdUser.setName(lowerCaseEmail);
      createdUser.setPassword(user.password);
      createdUser.save();
      const verificationLink = `http://localhost:5000//verify-email/${createdUser._id}`;
      await this.sendVerificationEmail(email, verificationLink);
      return await this.userModel.findById(createdUser._id);
    } catch (e) {
      throw new BadRequest(e.message);
    }
  }

  async createCategory(category: CreateCategoryDto): Promise<Category> {
    try {
      const { name } = category;
      const lowerCaseEmail = name.toLowerCase();

      const registrationCategory = await this.categoryModel.findOne({
        name: lowerCaseEmail,
      });
      if (registrationCategory) {
        throw new Conflict(`Category ${name} exist`);
      }

      const createdCategory = await this.categoryModel.create(category);
      createdCategory.save();

      return await this.categoryModel.findById(createdCategory._id);
    } catch (e) {
      throw new BadRequest(e.message);
    }
  }

  async addSubcategory(
    catId: string,
    subCategory: Subcategories,
  ): Promise<Category> {
    try {
      const find = await this.categoryModel.findById(catId).exec();
      const arr = find.subcategories;
      subCategory.id = uuidv4();
      arr.push(subCategory);
      await this.categoryModel.updateOne(
        { _id: catId },
        { $set: { subcategories: arr } },
      );
      return await this.categoryModel.findById(catId);
    } catch (e) {
      throw new NotFound('Category not found');
    }
  }

  async sendVerificationEmail(
    email: string,
    verificationLink: string,
  ): Promise<void> {
    const msg = {
      to: email,
      from: 'lusiy321@gmail.com',
      subject: 'Email Verification from Swep',
      html: `<p>Click the link below to verify your email:</p><p><a href="${verificationLink}">Click</a></p>`,
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      throw new Error('Failed to send verification email');
    }
  }

  async verifyUserEmail(id: any) {
    try {
      const user = await this.userModel.findById(id);
      user.verify = true;
      user.save();
    } catch (e) {
      throw new BadRequest(e.message);
    }
  }

  async changePassword(req: any, newPass: PasswordUserDto): Promise<User> {
    const user = await this.findToken(req);
    if (!user) {
      throw new Unauthorized('jwt expired');
    }
    try {
      const { oldPassword, password } = newPass;
      if (user.comparePassword(oldPassword) === true) {
        user.setPassword(password);
        user.save();
        const msg = {
          to: user.email,
          from: 'lusiy321@gmail.com',
          subject: 'Your password has been changed on swep.com',
          html: `<div class="container">
          <h1>Your Password Has Been Changed</h1>
          <p>Click on the link below to go to your personal account:</p>
          <p><a href="https://my-app-hazel-nine.vercel.app/ru/account/profile">Go to your account</a></p>
      </div>`,
        };
        await sgMail.send(msg);
        return await this.userModel.findById(user._id);
      }
      throw new BadRequest('Password is not avaible');
    } catch (e) {
      throw new BadRequest(e.message);
    }
  }

  async validateUser(details: GoogleUserDto) {
    const user = await this.userModel.findOne({ googleId: details.googleId });
    try {
      if (user === null) {
        const newUser = await this.userModel.create(details);
        newUser.save();
        const userUpdateToken = await this.userModel.findOne({
          email: details.email,
        });

        await this.userModel.createToken(userUpdateToken);
        return await this.userModel.findById({
          _id: userUpdateToken._id,
        });
      }

      await this.userModel.createToken(user);

      return await this.userModel.findOne({
        _id: user.id,
      });
    } catch (e) {
      throw new NotFound('User not found');
    }
  }

  async restorePassword(email: MailUserDto) {
    const restoreMail: User = await this.userModel.findOne(email);
    try {
      if (restoreMail) {
        const msg: any = {
          to: restoreMail.email,
          from: 'lusiy321@gmail.com',
          subject: 'Change your password on swep.com',
          html: `<div class="container">
          <h1>Your Password Has Been Changed</h1>
          <p>Click on the link below to go to your personal account:</p>
          <p><a href="https://my-app-hazel-nine.vercel.app/ru/account/profile">Go to your account</a></p>
      </div>`,
        };
        return await sgMail.send(msg);
      }
    } catch (e) {
      throw new BadRequest('User not found');
    }
  }

  async updateRestorePassword(
    id: string,
    newPass: UpdatePasswordUserDto,
  ): Promise<User> {
    const user = await this.userModel.findById(id);
    const { password } = newPass;
    try {
      if (user) {
        user.setPassword(password);
        user.save();
        const msg = {
          to: user.email,
          from: 'lusiy321@gmail.com',
          subject: 'Your password has been changed on swep.com',
          html: `<div class="container">
          <h1>Your Password Has Been Changed</h1>
          <p>Click on the link below to go to your personal account:</p>
          <p><a href="https://my-app-hazel-nine.vercel.app/ru/account/profile">Go to your account</a></p>
      </div>`,
        };
        await sgMail.send(msg);
        return await this.userModel.findById(user._id);
      }

      throw new BadRequest('User not found');
    } catch (e) {
      throw new BadRequest(e.message);
    }
  }

  async login(user: CreateUserDto): Promise<User> {
    try {
      const { email, password } = user;
      const lowerCaseEmail = email.toLowerCase();
      const authUser = await this.userModel.findOne({ email: lowerCaseEmail });
      if (!authUser || !authUser.comparePassword(password)) {
        throw new Unauthorized(`Email or password is wrong`);
      }
      return this.createToken(authUser);
    } catch (e) {
      throw new BadRequest(e.message);
    }
  }

  async logout(req: any): Promise<User> {
    const user = await this.findToken(req);
    if (!user) {
      throw new Unauthorized('jwt expired');
    }
    try {
      await this.userModel.findByIdAndUpdate({ _id: user.id }, { token: null });
      return await this.userModel.findById({ _id: user.id });
    } catch (e) {
      throw new BadRequest(e.message);
    }
  }

  async update(user: UpdateUserDto, req: any): Promise<User> {
    const {
      firstName,
      lastName,
      title,
      description,
      phone,
      telegram,
      viber,
      whatsapp,
      location,
      master_photo,
      photo,
      video,
      category,
      genre,
      price,
    } = user;
    console.log(req);
    const findId = await this.findToken(req);
    console.log(findId);
    if (!findId) {
      throw new Unauthorized('jwt expired');
    }
    try {
      if (
        firstName ||
        lastName ||
        title ||
        description ||
        phone ||
        telegram ||
        viber ||
        whatsapp ||
        location ||
        master_photo ||
        photo ||
        video ||
        category ||
        genre ||
        price
      ) {
        await this.userModel.findByIdAndUpdate(
          { _id: findId.id },
          {
            firstName,
            lastName,
            title,
            description,
            phone,
            telegram,
            viber,
            whatsapp,
            location,
            master_photo,
            photo,
            video,
            category,
            genre,
            price,
          },
        );
        const userUpdate = this.userModel.findById({ _id: findId.id });
        return userUpdate;
      }
    } catch (e) {
      throw new BadRequest(e.message);
    }
  }

  async findOrCreateUser(
    googleId: string,
    firstName: string,
    email: string,
  ): Promise<any> {
    try {
      let user = await this.userModel.findOne({ googleId });
      if (!user) {
        user = await this.userModel.create({
          googleId,
          firstName,
          email,
        });
        user.setPassword(googleId);
        return user.save();
      }
    } catch (e) {
      throw new NotFound('User not found');
    }
  }

  async findToken(req: any): Promise<User> {
    try {
      const { authorization = '' } = req.headers;
      const [bearer, token] = authorization.split(' ');

      if (bearer !== 'Bearer') {
        throw new Unauthorized('Not authorized');
      }

      const SECRET_KEY = process.env.SECRET_KEY;
      const findId = verify(token, SECRET_KEY) as JwtPayload;
      const user = await this.userModel.findById({ _id: findId.id });

      return user;
    } catch (e) {
      throw new Unauthorized('jwt expired');
    }
  }

  async createToken(authUser: { _id: string }) {
    const payload = {
      id: authUser._id,
    };
    const SECRET_KEY = process.env.SECRET_KEY;
    const token = sign(payload, SECRET_KEY, { expiresIn: '1m' });
    await this.userModel.findByIdAndUpdate(authUser._id, { token });
    const authentificationUser = await this.userModel.findById({
      _id: authUser._id,
    });
    return authentificationUser;
  }

  async refreshAccessToken(req: any): Promise<User> {
    try {
      const { authorization = '' } = req.headers;
      const [bearer, token] = authorization.split(' ');

      if (bearer !== 'Bearer') {
        throw new Unauthorized('Not authorized');
      }
      const SECRET_KEY = process.env.SECRET_KEY;
      const user = await this.userModel.findOne({ token: token });
      if (!user) {
        throw new NotFound('User not found');
      }
      const payload = {
        id: user._id,
      };
      const tokenRef = sign(payload, SECRET_KEY, { expiresIn: '24h' });
      await this.userModel.findByIdAndUpdate(user._id, { token: tokenRef });
      const authentificationUser = await this.userModel.findById({
        _id: user.id,
      });
      return authentificationUser;
    } catch (error) {
      throw new BadRequest('Invalid refresh token');
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
