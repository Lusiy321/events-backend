/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserSchema } from './users.model';
import { CreateUserDto } from './dto/create.user.dto';
import { compareSync, hashSync } from 'bcrypt';
import { Conflict, NotFound, BadRequest, Unauthorized } from 'http-errors';
import { UpdateUserDto, search_result } from './dto/update.user.dto';
import { sign, verify, JwtPayload } from 'jsonwebtoken';
import { PasswordUserDto } from './dto/password.user.dto';
import * as sgMail from '@sendgrid/mail';
import { MailUserDto } from './dto/email.user.dto';
import { UpdatePasswordUserDto } from './dto/updatePassword.user.dto';
import { GoogleUserDto } from './dto/google.user.dto';
import { Category } from './category.model';
import { v4 as uuidv4 } from 'uuid';
import { Categories, Subcategory } from './dto/caterory.interface';
import { verifyEmailMsg } from './utils/email.schemas';
import {
  mergeAndRemoveDuplicates,
  paginateArray,
  rows,
} from './utils/parse.user';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: User,
    @InjectModel(Category.name) private categoryModel: Category,
  ) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
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
      const find = await this.userModel.findById(id).select(rows).exec();
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

        // const verificationLink = `${process.env.BACK_LINK}verify-email/${createdUser._id}`;
        // await this.sendVerificationEmail(email, verificationLink);
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
    const body = await verifyEmailMsg(verificationLink);
    const msg = {
      to: email,
      from: 'lusiy321@gmail.com',
      subject: 'Підтвердження e-mail Wechirka.com',
      html: body,
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
          <p><a href="${process.env.FRONT_LINK}/profile">Go to your account</a></p>
      </div>`,
        };
        await sgMail.send(msg);
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
          <p><a href="${process.env.FRONT_LINK}profile">Go to your account</a></p>
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
          <p><a href="${process.env.FRONT_LINK}profile"> Go to your account </a></p>
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
      title,
      description,
      phone,
      telegram,
      whatsapp,
      location,
      master_photo,
      video,
      category,
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
        category ||
        price
      ) {
        if (category) {
          const findUser = await this.userModel.findById(findId.id).exec();
          const arrCategory = findUser.category;
          function addSubcategory(
            categories: Category[],
            categoryId: string,
            newSubcategory: Subcategory,
            newCategory: Categories[],
          ) {
            if (Array.isArray(categories) && categories.length === 0) {
              categories.push(...newCategory);

              return categories;
            }
            const updatedCategories = categories.map((category) => {
              if (category._id === categoryId) {
                const existingSubcategory = category.subcategories.find(
                  (sub) => sub.id === newSubcategory.id,
                );

                if (existingSubcategory) {
                  return category;
                }

                return {
                  ...category,
                  subcategories: [...category.subcategories, newSubcategory],
                };
              } else if (category._id !== categoryId) {
                categories.push(...newCategory);
                return categories;
              }
            });
            return updatedCategories;
          }

          const newCategoryArr = addSubcategory(
            arrCategory,
            category[0]._id,
            category[0].subcategories[0],
            category,
          );
          await this.userModel.findByIdAndUpdate(
            { _id: findId.id },
            {
              $set: { category: newCategoryArr },
            },
          );
          return await this.userModel.findById({ _id: findId.id });
        }
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
        const user = await this.userModel
          .findById({ _id: findId.id })
          .select('-password')
          .exec();
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
