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
import { Categories, Subcategory } from './dto/caterory.interface';
import { verifyEmailMsg } from './utils/email.schemas';

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

  async searchUsers(query: any): Promise<User[]> {
    const { req, loc } = query;

    try {
      const searchItem = req;
      const regexReq = new RegExp(searchItem, 'i');
      const regexLoc = new RegExp(loc, 'i');
      if (searchItem === '' && loc === '') {
        return this.userModel.find(req).exec();
      }
      if (req !== '' && loc === '') {
        const findTitle = await this.userModel
          .find({
            title: { $regex: regexReq },
          })
          .exec();
        const findCat = await this.userModel
          .find({
            category: {
              $elemMatch: {
                name: { $regex: regexReq },
              },
            },
          })
          .exec();
        const findSubcat = await this.userModel
          .find({
            'category.subcategories': {
              $elemMatch: {
                name: { $regex: regexReq },
              },
            },
          })
          .exec();
        const findDescr = await this.userModel
          .find({
            description: { $regex: regexReq },
            location: { $regex: regexLoc },
          })
          .exec();
        const category = await this.userModel
          .find({
            category: {
              $elemMatch: {
                _id: req,
              },
            },
          })
          .exec();
        const subcategory = await this.userModel
          .find({
            'category.subcategories': {
              $elemMatch: {
                id: req,
              },
            },
          })
          .exec();

        function mergeAndRemoveDuplicates(...arrays: User[]) {
          const mergedArray = [].concat(...arrays);
          const uniqueArray = Array.from(new Set(mergedArray));
          return uniqueArray;
        }
        const resultArray = mergeAndRemoveDuplicates(
          findTitle,
          findDescr,
          category,
          subcategory,
          findCat,
          findSubcat,
        );

        return resultArray;
      } else if (req === '' && loc !== '') {
        const findLocation = await this.userModel
          .find({
            location: { $regex: regexLoc },
          })
          .exec();

        return findLocation;
      } else if (req !== '' && loc !== '') {
        const findTitle = await this.userModel
          .find({
            title: { $regex: regexReq },
            location: { $regex: regexLoc },
          })
          .exec();

        const findDescr = await this.userModel
          .find({
            description: { $regex: regexReq },
            location: { $regex: regexLoc },
          })
          .exec();

        const category = await this.userModel
          .find({
            category: {
              $elemMatch: {
                _id: req,
              },
            },
            location: { $regex: regexLoc },
          })
          .exec();

        const subcategory = await this.userModel
          .find({
            'category.subcategories': {
              $elemMatch: {
                id: req,
              },
            },
            location: { $regex: regexLoc },
          })
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
          .exec();

        function mergeAndRemoveDuplicates(...arrays: any[]) {
          const mergedArray = [].concat(...arrays);
          const uniqueArray = Array.from(new Set(mergedArray));
          return uniqueArray;
        }
        const resultArray = mergeAndRemoveDuplicates(
          findTitle,
          findDescr,
          category,
          subcategory,
          findCat,
          findSubcat,
        );

        return resultArray;
      } else {
        throw new NotFound('Post not found');
      }
    } catch (e) {
      throw new NotFound('Post not found');
    }
  }

  async findAllUsers(): Promise<User[]> {
    try {
      const find = await this.userModel.find().exec();
      return find;
    } catch (e) {
      throw new NotFound('User not found');
    }
  }

  async findById(id: string): Promise<User> {
    try {
      const find = await this.userModel.findById(id).exec();
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
      // const verificationLink = `${process.env.BACK_LINK}verify-email/${createdUser._id}`;
      // await this.sendVerificationEmail(email, verificationLink);
      return await this.userModel.findById(createdUser._id);
    } catch (e) {
      throw new BadRequest(e.message);
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
      await this.createToken(authUser);
      return await this.userModel.findOne({ email: lowerCaseEmail });
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
        lastName ||
        title ||
        description ||
        phone ||
        telegram ||
        viber ||
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
            lastName,
            title,
            description,
            phone,
            telegram,
            viber,
            whatsapp,
            location,
            master_photo,
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
      return await this.userModel.findById({ _id: user.id });
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
        const user = await this.userModel.findById({ _id: findId.id });
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
  // CATEGORY
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
  async addUsercategory(
    userID: string,
    categoryID: string,
    subcategoryID: string,
  ): Promise<User> {
    try {
      const findUser = await this.userModel.findById(userID).exec();
      const arrCategory = findUser.category;
      const findCategory = await this.categoryModel.findById(categoryID).exec();
      const arrSubcategory = findCategory.subcategories;

      function searchById(arr: Array<any>, id: string) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].id === id) {
            return arr[i];
          }
        }
        return null;
      }
      const result = searchById(arrSubcategory, subcategoryID);
      findCategory.subcategories = [];
      findCategory.subcategories.push(result);
      arrCategory.push(findCategory);

      await this.userModel.updateOne(
        { _id: userID },
        { $set: { category: arrCategory } },
      );
      return await this.userModel.findById(userID);
    } catch (e) {
      throw new NotFound('Category not found');
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

  async findCategory(): Promise<Category[]> {
    try {
      const find = await this.categoryModel.find().exec();
      return find;
    } catch (e) {
      throw new NotFound('User not found');
    }
  }

  async findUserCategory(id: string) {
    try {
      const find = await this.userModel.find({ 'category._id': id }).exec();
      if (Array.isArray(find) && find.length === 0) {
        return new NotFound('User not found');
      }
      return find;
    } catch (e) {
      throw new NotFound('User not found');
    }
  }

  async findUserSubcategory(id: string) {
    try {
      const find = await this.userModel
        .find({ 'category.subcategories.id': id })
        .exec();
      if (Array.isArray(find) && find.length === 0) {
        return new NotFound('User not found');
      }
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
