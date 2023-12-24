/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserSchema } from './users.model';
import { CreateUserDto } from './dto/create.user.dto';
import { compareSync, hashSync } from 'bcrypt';
import { Conflict, NotFound, BadRequest, Unauthorized } from 'http-errors';
import { UpdateUserDto, search_result } from './dto/update.user.dto';
import { sign, verify, JwtPayload } from 'jsonwebtoken';
import { PasswordUserDto } from './dto/password.user.dto';
import { MailUserDto } from './dto/email.user.dto';
import { GoogleUserDto } from './dto/google.user.dto';
import { Category } from './category.model';
import { Categories, Subcategory } from './dto/caterory.interface';
import { verifyEmailMsg } from './utils/email.schemas';
import {
  mergeAndRemoveDuplicates,
  paginateArray,
  rows,
} from './utils/parse.user';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
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

  async searchUsers(query: any): Promise<search_result> {
    const { req, loc, page, cat, subcat } = query;
    try {
      const curentPage = page || 1;
      const limit = 8;
      const totalCount = await this.userModel.countDocuments();

      const totalPages = Math.ceil(totalCount / limit);
      const offset = (curentPage - 1) * limit;
      // Если ничего не задано в строке
      if (!req && !loc && !cat && !subcat) {
        const result = await this.userModel
          .find() // добавить поиск по verify
          .select(rows)
          .skip(offset)
          .sort({ createdAt: -1 })
          .limit(limit)
          .exec();
        return {
          totalPages: totalPages,
          currentPage: curentPage,
          data: result,
        };
      }

      const regexReq = new RegExp(req, 'i');
      const regexLoc = new RegExp(loc, 'i');
      // Если заданы пустые значения
      if (
        (req === '' && loc === '') ||
        (!req && !loc) ||
        (cat && !subcat) ||
        (!cat && subcat)
      ) {
        const category = await this.userModel
          .find({
            category: {
              $elemMatch: {
                _id: cat,
              },
            },
          })
          .select(rows)
          .exec();
        const subcategory = await this.userModel
          .find({
            'category.subcategories': {
              $elemMatch: {
                id: subcat,
              },
            },
          })
          .select(rows)
          .exec();
        const resultArray = mergeAndRemoveDuplicates(category, subcategory);
        if (Array.isArray(resultArray) && resultArray.length === 0) {
          throw new NotFound('Users not found');
        } else {
          const result = paginateArray(resultArray, curentPage);
          const totalPages = Math.ceil(resultArray.length / limit);
          return {
            totalPages: totalPages,
            currentPage: curentPage,
            data: result,
          };
        }
      }
      // Если есть запрос без локации
      if ((req !== '' && loc === '') || !loc) {
        const findTitle = await this.userModel
          .find({
            title: { $regex: regexReq },
          })
          .select(rows)
          .exec();
        const findCat = await this.userModel
          .find({
            category: {
              $elemMatch: {
                name: { $regex: regexReq },
              },
            },
          })
          .select(rows)
          .exec();
        const findSubcat = await this.userModel
          .find({
            'category.subcategories': {
              $elemMatch: {
                name: { $regex: regexReq },
              },
            },
          })
          .select(rows)
          .exec();
        const findDescr = await this.userModel
          .find({
            description: { $regex: regexReq },
            location: { $regex: regexLoc },
          })
          .select(rows)
          .exec();
        const category = await this.userModel
          .find({
            category: {
              $elemMatch: {
                _id: cat,
              },
            },
          })
          .select(rows)
          .exec();
        const subcategory = await this.userModel
          .find({
            'category.subcategories': {
              $elemMatch: {
                id: subcat,
              },
            },
          })
          .select(rows)
          .exec();
        const findLocation = await this.userModel
          .find({
            location: { $regex: regexReq },
          })
          .select(rows)
          .exec();
        const findName = await this.userModel
          .find({
            firstName: { $regex: regexReq },
          })
          .select(rows)
          .exec();

        const resultArray = mergeAndRemoveDuplicates(
          findTitle,
          findDescr,
          category,
          subcategory,
          findCat,
          findSubcat,
          findLocation,
          findName,
        );
        if (Array.isArray(resultArray) && resultArray.length === 0) {
          throw new NotFound('Users not found');
        } else {
          const result = paginateArray(resultArray, curentPage);
          const totalPages = Math.ceil(resultArray.length / limit);
          return {
            totalPages: totalPages,
            currentPage: curentPage,
            data: result,
          };
        }
        //Если нет запроса, но есть локация
      } else if ((req === '' && loc !== '') || !req) {
        const findLocation = await this.userModel
          .find({
            location: { $regex: regexLoc },
          })
          .select(rows)
          .skip(offset)
          .limit(limit)
          .exec();
        const category = await this.userModel
          .find({
            category: {
              $elemMatch: {
                _id: cat,
              },
            },
          })
          .select(rows)
          .exec();
        const subcategory = await this.userModel
          .find({
            'category.subcategories': {
              $elemMatch: {
                id: subcat,
              },
            },
          })
          .select(rows)
          .exec();

        const resultArray = mergeAndRemoveDuplicates(
          category,
          subcategory,
          findLocation,
        );

        if (Array.isArray(resultArray) && findLocation.length === 0) {
          throw new NotFound('User not found');
        } else {
          const result = paginateArray(resultArray, curentPage);
          const totalPages = Math.ceil(resultArray.length / limit);
          return {
            totalPages: totalPages,
            currentPage: curentPage,
            data: result,
          };
        }
      } else if (req !== '' && loc !== '') {
        const findTitle = await this.userModel
          .find({
            title: { $regex: regexReq },
            location: { $regex: regexLoc },
          })
          .select(rows)
          .exec();

        const findDescr = await this.userModel
          .find({
            description: { $regex: regexReq },
            location: { $regex: regexLoc },
          })
          .select(rows)
          .exec();

        const category = await this.userModel
          .find({
            category: {
              $elemMatch: {
                _id: cat,
              },
            },
            location: { $regex: regexLoc },
          })
          .select(rows)
          .exec();

        const subcategory = await this.userModel
          .find({
            'category.subcategories': {
              $elemMatch: {
                id: subcat,
              },
            },
            location: { $regex: regexLoc },
          })
          .select(rows)
          .exec();
        const findCat = await this.userModel
          .find({
            category: {
              $elemMatch: {
                name: { $regex: regexReq },
              },
            },
            location: { $regex: regexLoc },
          })
          .select(rows)
          .exec();
        const findSubcat = await this.userModel
          .find({
            'category.subcategories': {
              $elemMatch: {
                name: { $regex: regexReq },
              },
            },
            location: { $regex: regexLoc },
          })
          .select(rows)
          .exec();
        const findName = await this.userModel
          .find({
            firstName: { $regex: regexReq },
            location: { $regex: regexLoc },
          })
          .select(rows)
          .exec();

        const resultArray = mergeAndRemoveDuplicates(
          findTitle,
          findDescr,
          category,
          subcategory,
          findCat,
          findSubcat,
          findName,
        );

        if (Array.isArray(resultArray) && resultArray.length === 0) {
          throw new NotFound('User not found');
        } else {
          const result = paginateArray(resultArray, curentPage);
          const totalPages = Math.ceil(resultArray.length / limit);
          return {
            totalPages: totalPages,
            currentPage: curentPage,
            data: result,
          };
        }
      }
    } catch (e) {
      throw new NotFound('User not found');
    }
  }

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
        });
        createdUser.setName(lowerCaseEmail);
        createdUser.setPassword(password);
        createdUser.save();

        const verificationLink = `${process.env.BACK_LINK}verify-email/${createdUser._id}`;
        await this.sendVerificationEmail(email, verificationLink);
        return await this.userModel
          .findById(createdUser._id)
          .select(rows)
          .exec();
      } else {
        throw new BadRequest('Missing parameters');
      }
    } catch (e) {
      throw new BadRequest(e.message);
    }
  }

  async checkTrialStatus(id: string): Promise<boolean> {
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
  }

  async sendVerificationEmail(
    email: string,
    verificationLink: string,
  ): Promise<void> {
    try {
      const body = await verifyEmailMsg(verificationLink);
      const msg = {
        from: process.env.NOREPLY_MAIL,
        to: email,
        subject: 'Wechirka.com - підтведження реєстрації',
        html: body,
      };

      await this.transporter.sendMail(msg);
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
        await this.userModel.findByIdAndUpdate(
          { _id: user._id },
          { password: user.password },
        );
        const msg = {
          to: user.email,
          from: process.env.NOREPLY_MAIL,
          subject: 'Зміна пароля',
          html: `<div class="container">
          <h1>Ваш пароль було змінено на Wechirka.com</h1>
          <p>Натисніть на посіляння для переходу на сайт:</p>
          <p><a href="${process.env.FRONT_LINK}profile">Перейти у профіль</a></p>
      </div>`,
        };
        await this.transporter.sendMail(msg);
        return await this.userModel.findById(user._id).select(rows).exec();
      }
      throw new BadRequest('Password is not avaible');
    } catch (e) {
      throw new BadRequest(e.message);
    }
  }

  async validateUser(details: GoogleUserDto) {
    const user = await this.userModel.findOne({ googleId: details.googleId });
    try {
      if (!user) {
        await this.userModel.create(details);
        const userUpdateToken = await this.userModel.findOne({
          email: details.email,
        });

        await this.createToken(userUpdateToken);
        return await this.userModel.findById({ _id: userUpdateToken._id });
      }

      await this.createToken(user);
      return await this.userModel.findOne({ _id: user.id });
    } catch (e) {
      throw new Error('Error validating user');
    }
  }

  async validateFacebook(details: any) {
    const user = await this.userModel.findOne({
      facebookId: details.facebookId,
    });
    try {
      if (!user) {
        const createdUser = await this.userModel.create(details);
        createdUser.setPassword(details.password);
        createdUser.save();
        const userUpdateToken = await this.userModel.findOne({
          email: details.email,
        });

        await this.createToken(userUpdateToken);
        return await this.userModel.findById({ _id: userUpdateToken._id });
      }

      await this.createToken(user);
      return await this.userModel.findOne({ _id: user.id });
    } catch (e) {
      throw new Error('Error validating user');
    }
  }

  async restorePassword(email: MailUserDto) {
    const restoreMail: User = await this.userModel.findOne(email);
    try {
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

        const msg: any = {
          to: restoreMail.email,
          from: process.env.NOREPLY_MAIL,
          subject: 'Відновлення пароля на Wechirka.com',
          html: `<div class="container">
          <h1>Ваш пароль було змінено</h1>
          <p>Новий пароль для входу: ${newPassword}</p>
          <p>Натисніть на посіляння для переходу на сайт:</p>
          <p><a href="${process.env.FRONT_LINK}auth/login">Перейти за посиланням для в ходу</a></p>
      </div>`,
        };
        return await this.transporter.sendMail(msg);
      }
    } catch (e) {
      throw new BadRequest('User not found');
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
      await this.checkTrialStatus(authUser._id);
      await this.createToken(authUser);
      return await this.userModel
        .findOne({ email: lowerCaseEmail })
        .select('-password')
        .exec();
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
      return await this.userModel
        .findById({ _id: user.id })
        .select('-password')
        .exec();
    } catch (e) {
      throw new BadRequest(e.message);
    }
  }

  async update(user: UpdateUserDto, req: any): Promise<User> {
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
    } = user;
    const findId = await this.findToken(req);

    if (!findId) {
      throw new Unauthorized('jwt expired');
    }
    try {
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
        social
      ) {
        if (video) {
          const findUser = await this.userModel.findById(findId.id).exec();
          const arrVideo = findUser.video;
          if (arrVideo.length <= 4) {
            arrVideo.push(...video);
            await this.userModel.findByIdAndUpdate(
              { _id: findId.id },
              {
                $set: { video: arrVideo },
              },
            );
            return await this.userModel.findById({ _id: findId.id });
          } else {
            throw new NotFound('To many videos');
          }
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
            social,
          },
        );

        return await this.userModel
          .findById({ _id: findId.id })
          .select(rows)
          .exec();
      }
    } catch (e) {
      throw new BadRequest(e.message);
    }
  }

  async updateCategory(data: Categories, req: any) {
    const category = [data];
    const findId = await this.findToken(req);
    const findUser = await this.userModel.findById(findId.id).exec();
    const arrCategory = findUser.category;
    function addSubcategory(
      categories: Categories[],
      newCategory: Categories[],
    ) {
      if (Array.isArray(categories) && categories.length === 0) {
        categories.push(...newCategory);
        return categories;
      } else {
        const combinedArray = [...categories, ...newCategory];
        const idMap = new Map<string, any>();

        combinedArray.forEach((obj) => {
          idMap.set(obj._id, obj);
        });
        const uniqueArray = Array.from(idMap.values());
        return uniqueArray;
      }
    }

    const newCategoryArr = addSubcategory(arrCategory, category);

    await this.userModel.findByIdAndUpdate(
      { _id: findId.id },
      {
        $set: { category: newCategoryArr },
      },
    );
    return await this.userModel
      .findById({ _id: findId.id })
      .select(rows)
      .exec();
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
      throw new Unauthorized('jwt expired');
    }
  }

  async createToken(authUser: { _id: string }) {
    const payload = {
      id: authUser._id,
    };
    const SECRET_KEY = process.env.SECRET_KEY;
    const token = sign(payload, SECRET_KEY, { expiresIn: '10m' });
    await this.userModel.findByIdAndUpdate(authUser._id, { token });
    const authentificationUser = await this.userModel
      .findById({
        _id: authUser._id,
      })
      .select('-password')
      .exec();
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
      const authentificationUser = await this.userModel
        .findById({
          _id: user.id,
        })
        .select('-password')
        .exec();
      return authentificationUser;
    } catch (error) {
      throw new BadRequest('Invalid refresh token');
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

  async monoPayment(amount: number) {
    const privateKey = 'ufV_RSdULOS - VD7HnIJGQCVCxdsn1VsPn6x6WgS5DfzM';
    let pubKeyBase64 =
      'LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUZrd0V3WUhLb1pJemowQ0FRWUlLb1pJemowREFRY0RRZ0FFQUc1LzZ3NnZubGJZb0ZmRHlYWE4vS29CbVVjTgo3NWJSUWg4MFBhaEdldnJoanFCQnI3OXNSS0JSbnpHODFUZVQ5OEFOakU1c0R3RmZ5Znhub0ZJcmZBPT0KLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tCg==';

    let xSignBase64 =
      'MEUCIQC/mVKhi8FKoayul2Mim3E2oaIOCNJk5dEXxTqbkeJSOQIgOM0hsW0qcP2H8iXy1aQYpmY0SJWEaWur7nQXlKDCFxA=';

    let message = `{
    "invoiceId": "p2_9ZgpZVsl3",
    "status": "created",
    "failureReason": "string",
    "amount": 4200,
    "ccy": 980,
    "finalAmount": 4200,
    "createdDate": "2019-08-24T14:15:22Z",
    "modifiedDate": "2019-08-24T14:15:22Z",
    "reference": "84d0070ee4e44667b31371d8f8813947",
    "cancelList": [
      {
        "status": "processing",
        "amount": 4200,
        "ccy": 980,
        "createdDate": "2019-08-24T14:15:22Z",
        "modifiedDate": "2019-08-24T14:15:22Z",
        "approvalCode": "662476",
        "rrn": "060189181768",
        "extRef": "635ace02599849e981b2cd7a65f417fe"
      }
    ]
  }`;

    let signatureBuf = Buffer.from(xSignBase64, 'base64');
    let publicKeyBuf = Buffer.from(pubKeyBase64, 'base64');

    let verify = crypto.createVerify('SHA256');

    verify.write(message);
    verify.end();

    let result = verify.verify(publicKeyBuf, signatureBuf);

    console.log(result === true ? 'OK' : 'NOT OK');
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
