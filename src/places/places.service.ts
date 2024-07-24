/* eslint-disable prettier/prettier */
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { compareSync, hashSync } from 'bcryptjs';
import {
  Conflict,
  NotFound,
  BadRequest,
  Unauthorized,
  NotAcceptable,
} from 'http-errors';
import { sign, verify, JwtPayload } from 'jsonwebtoken';
import { verifyEmailMsg } from '../users/utils/emails/email.schemas';
import { placeRows } from '../users/utils/parse.user';
import * as nodemailer from 'nodemailer';
import { changePasswordEmailMsg } from '../users/utils/emails/email.changePassword';
import { restorePasswordEmailMsg } from '../users/utils/emails/email.restorePassword';
import { CloudinaryService } from '../users/cloudinary.service';
import { delUserMsg } from '../users/utils/emails/email.delete';
import { Categories } from '../users/utils/user.types';
import { Place, PlaceSchema } from './places.model';
import { CreatePlaceDto } from './dto/create.place.dto';
import { PasswordChangePlaceDto } from './dto/change-password.place.dto';
import { GooglePlaceDto } from './dto/google.place.dto';
import { MailUserDto } from './dto/email.user.dto';

import { PasswordUserDto } from 'src/users/dto/password.user.dto';
import { UpdatePlaceDto } from './dto/update.place.dto';
import { LoginUserDto } from 'src/users/dto/login.user.dto';
import { CategoryPlace } from './category.place.model';

export const TRANSPORTER_PROVIDER = 'TRANSPORTER_PROVIDER';

@Injectable()
export class PlacesService {
  constructor(
    @InjectModel(Place.name)
    private placeModel: Place,
    @InjectModel(CategoryPlace.name) private categoryModel: CategoryPlace,
    @Inject(TRANSPORTER_PROVIDER)
    private transporter: nodemailer.Transporter,
    private readonly cloudinaryService: CloudinaryService,
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

  async findAllPlaces(): Promise<Place[]> {
    try {
      const find = await this.placeModel.find().select(placeRows);
      return find;
    } catch (e) {
      throw new NotFound('Place not found');
    }
  }

  async findById(id: string): Promise<Place> {
    try {
      const find = await this.placeModel
        .findById(id)
        .select('-password')
        .exec();
      await this.checkTrialStatus(id);
      return find;
    } catch (e) {
      throw new NotFound('Place not found');
    }
  }

  async create(place: CreatePlaceDto): Promise<Place> {
    try {
      const { email, password, phone, placeName } = place;
      if (email && password && phone && placeName) {
        const lowerCaseEmail = email.toLowerCase();

        const registrationUser = await this.placeModel.findOne({
          email: lowerCaseEmail,
        });
        if (registrationUser) {
          throw new Conflict(`User with ${email} in use`);
        }
        const trialEnds = new Date();
        trialEnds.setMonth(trialEnds.getMonth() + 2);

        const createdPlace = await this.placeModel.create({
          ...place,
          trial: true,
          trialEnds,
          paidEnds: trialEnds,
        });
        createdPlace.setPassword(password);
        createdPlace.save();
        await this.createToken(createdPlace);
        await this.sendVerificationEmail(email);
        return await this.placeModel
          .findById(createdPlace._id)
          .select(placeRows)
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
      const place = await this.placeModel
        .findById(id)
        .select('-password')
        .exec();
      if (!place) {
        throw new NotFound('User not found');
      }
      if (place.trial && place.trialEnds > new Date()) {
        return true;
      } else {
        place.trial = false;
        await place.save();
        return false;
      }
    } catch (e) {
      throw e;
    }
  }

  async sendVerificationEmail(email: string): Promise<void> {
    try {
      const place = await this.placeModel.findOne({ email: email });

      const body = await verifyEmailMsg(place.id);
      const msg = {
        from: process.env.NOREPLY_MAIL,
        to: email,
        subject: 'Wechirka.com - підтведження реєстрації',
        html: body,
      };

      await this.transporter.sendMail(msg);
      return place;
    } catch (error) {
      throw new Error('Failed to send verification email');
    }
  }

  async verifyPlaceEmail(id: any) {
    try {
      const place = await this.placeModel.findById(id);
      if (!place) {
        throw new NotFound('User not found');
      }
      await this.placeModel.findByIdAndUpdate({ _id: id }, { verify: true });
      return await this.placeModel.findById(id);
    } catch (e) {
      throw e;
    }
  }

  async changePassword(
    req: any,
    newPass: PasswordChangePlaceDto,
  ): Promise<Place> {
    const place = await this.findToken(req);
    if (!place) {
      throw new Unauthorized('jwt expired');
    }
    try {
      const { oldPassword, password } = newPass;
      if (place.comparePassword(oldPassword) === true) {
        place.setPassword(password);
        await this.placeModel.findByIdAndUpdate(
          { _id: place._id },
          { password: place.password },
        );
        const body = await changePasswordEmailMsg();
        const msg = {
          to: place.email,
          from: process.env.NOREPLY_MAIL,
          subject: 'Зміна пароля',
          html: body,
        };
        await this.transporter.sendMail(msg);
        return await this.placeModel
          .findById(place._id)
          .select(placeRows)
          .exec();
      }
      throw new BadRequest('Password is not avaible');
    } catch (e) {
      throw e;
    }
  }

  async validatePlace(details: GooglePlaceDto) {
    try {
      const place = await this.placeModel.findOne({ email: details.email });
      if (place) {
        if (place.googleId === details.googleId) {
          await this.checkTrialStatus(place._id);
          await this.createToken(place);
          return await this.placeModel.findOne({ _id: place.id });
        }
        if (!place.googleId) {
          await this.placeModel.findByIdAndUpdate(
            { _id: place.id },
            { googleId: details.googleId },
          );
          await this.checkTrialStatus(place._id);
          await this.createToken(place);
          return await this.placeModel.findOne({ _id: place.id });
        }
      }

      if (!place) {
        const trialEnds = new Date();
        trialEnds.setMonth(trialEnds.getMonth() + 2);
        const createdPlace = await this.placeModel.create({
          ...details,
          trial: true,
          verify: true,
          trialEnds,
          paidEnds: trialEnds,
        });
        createdPlace.setPassword(details.password);
        createdPlace.save();
        const placeUpdateToken = await this.placeModel.findOne({
          email: details.email,
        });
        await this.sendVerificationEmail(details.email);
        const newPlace = await this.createToken(placeUpdateToken);
        return newPlace;
      }
    } catch (e) {
      throw new Error('Error validating user');
    }
  }

  async validateFacebook(details: any) {
    try {
      const place = await this.placeModel.findOne({
        email: details.email,
      });
      if (place) {
        if (place.facebookId === details.facebookId) {
          await this.checkTrialStatus(place._id);
          const newPlace = await this.createToken(place);
          return newPlace;
        }
        if (!place.facebookId) {
          await this.placeModel.findByIdAndUpdate(
            { _id: place.id },
            { facebookId: details.facebookId },
          );
          await this.checkTrialStatus(place._id);
          const newPlace = await this.createToken(place);
          return newPlace;
        }
      }
      if (!place) {
        const trialEnds = new Date();
        trialEnds.setMonth(trialEnds.getMonth() + 2);
        const createdPlace = await this.placeModel.create({
          ...details,
          trial: true,
          trialEnds,
          verify: true,
          paidEnds: trialEnds,
        });
        createdPlace.setPassword(details.password);
        createdPlace.save();
        const placeUpdateToken = await this.placeModel.findOne({
          email: details.email,
        });
        await this.sendVerificationEmail(details.email);
        const newPlace = await this.createToken(placeUpdateToken);
        return newPlace;
      }
    } catch (e) {
      throw new Error('Error validating place');
    }
  }

  async restorePassword(email: MailUserDto) {
    try {
      const restoreMail: Place = await this.placeModel.findOne(email);
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
        await this.placeModel.findByIdAndUpdate(
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

  async login(place: LoginUserDto): Promise<Place> {
    try {
      const { email, password } = place;
      const lowerCaseEmail = email.toLowerCase();
      const authPlace = await this.placeModel.findOne({
        email: lowerCaseEmail,
      });
      if (!authPlace || !authPlace.comparePassword(password)) {
        throw new Unauthorized(`Email or password is wrong`);
      }
      if (authPlace.verify === false) {
        throw new NotAcceptable(`Email not verify`);
      }
      await this.checkTrialStatus(authPlace._id);
      await this.createToken(authPlace);
      return await this.placeModel
        .findOne({ email: lowerCaseEmail })
        .select('-password')
        .exec();
    } catch (e) {
      throw e;
    }
  }

  async logout(req: any): Promise<Place> {
    const place = await this.findToken(req);
    if (!place) {
      throw new Unauthorized('jwt expired');
    }
    try {
      await this.placeModel.findByIdAndUpdate(
        { _id: place.id },
        { token: null },
      );
      return await this.placeModel
        .findById({ _id: place.id })
        .select('-password')
        .exec();
    } catch (e) {
      throw e;
    }
  }

  async deletePlaceProfile(
    req: any,
    placePassword: PasswordUserDto,
  ): Promise<Place> {
    try {
      const place = await this.findToken(req);
      if (!place) {
        throw new Unauthorized('jwt expired');
      }
      const { password } = placePassword;
      if (place.comparePassword(password) === true) {
        await this.cloudinaryService.deleteAllPlaceImages(place);
        await this.placeModel.findByIdAndRemove({ _id: place._id });
        const body = delUserMsg;
        const msg = {
          to: place.email,
          from: process.env.NOREPLY_MAIL,
          subject: 'Видалення профілю',
          html: body,
        };
        await this.transporter.sendMail(msg);
        return place;
      }
      throw new BadRequest('Password is not avaible');
    } catch (e) {
      throw e;
    }
  }

  async updatePlace(place: UpdatePlaceDto, req: any): Promise<Place> {
    try {
      const {
        placeName,
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
      } = place;
      const findId = await this.findToken(req);

      if (!findId) {
        throw new Unauthorized('jwt expired');
      }

      if (
        placeName ||
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
          await this.placeModel.findByIdAndUpdate(
            { _id: findId.id },
            {
              $push: { video: { $each: video, $slice: 5 } },
            },
          );
          return await this.placeModel
            .findById({ _id: findId.id })
            .select(placeRows)
            .exec();
        }
        if (social) {
          const updatedSocial = { ...findId.social, ...social };

          const sanitizedSocial = Object.entries(updatedSocial)
            .filter(([key, value]) => key && value)
            .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

          await this.placeModel.findByIdAndUpdate(
            { _id: findId.id },
            { $set: { social: sanitizedSocial } },
          );

          return await this.placeModel
            .findById({ _id: findId.id })
            .select(placeRows)
            .exec();
        }
        await this.placeModel.findByIdAndUpdate(
          { _id: findId.id },
          {
            placeName,
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

        return await this.placeModel
          .findById({ _id: findId.id })
          .select(placeRows)
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

  async updateCategory(data: Categories, req: any): Promise<Place> {
    try {
      const newCategory = data;
      const findId = await this.findToken(req);
      if (!findId) {
        throw new Unauthorized('jwt expired');
      }
      const findUser = await this.placeModel.findById(findId.id).exec();
      const arrCategory = findUser.category;
      const newCategoryArr = await this.addSubcategory(
        arrCategory,
        newCategory,
      );
      await this.placeModel.updateOne(
        { _id: findId.id },
        {
          $set: { category: newCategoryArr },
        },
      );

      return await this.placeModel
        .findById({ _id: findId.id })
        .select(placeRows)
        .exec();
    } catch (e) {
      throw e;
    }
  }

  async deleteCategory(id: string, req: any) {
    try {
      const place = await this.findToken(req);
      if (!place) {
        throw new Unauthorized('jwt expired');
      }
      const updatedCategories = place.category
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

      await this.placeModel.updateOne(
        { _id: place.id },
        {
          $set: { category: updatedCategories },
        },
      );
      return await this.placeModel
        .findById({ _id: place.id })
        .select(placeRows)
        .exec();
    } catch (e) {
      throw e;
    }
  }

  async deletePlaceVideo(id: string, req: any) {
    const place = await this.findToken(req);
    if (!place) {
      throw new Unauthorized('jwt expired');
    }
    try {
      const videoArray = place.video;
      const newArr = videoArray.filter((video) => video.publicId !== id);
      await this.placeModel.findByIdAndUpdate(
        { _id: place.id },
        {
          $set: { video: newArr },
        },
      );
      return await this.placeModel
        .findById({ _id: place.id })
        .select(placeRows)
        .exec();
    } catch (e) {
      throw e;
    }
  }

  // JWT TOKEN
  async findToken(req: any): Promise<Place> {
    try {
      const { authorization = '' } = req.headers;
      const [bearer, token] = authorization.split(' ');
      if (bearer !== 'Bearer') {
        throw new Unauthorized('Not authorized');
      } else {
        const SECRET_KEY = process.env.SECRET_KEY;
        const findId = verify(token, SECRET_KEY) as JwtPayload;
        const place = await this.placeModel.findById({ _id: findId.id }).exec();
        return place;
      }
    } catch (e) {
      if (e.message === 'jwt expired') {
        throw new Unauthorized('jwt expired');
      } else {
        throw e;
      }
    }
  }

  async createToken(authPlace: { _id: string }) {
    try {
      const payload = {
        id: authPlace._id,
      };
      const SECRET_KEY = process.env.SECRET_KEY;
      const token = sign(payload, SECRET_KEY, { expiresIn: '1m' });
      const refreshToken = sign(payload, SECRET_KEY);
      const authentificationPlace = await this.placeModel
        .findById({
          _id: authPlace._id,
        })
        .select('-password')
        .exec();
      if (authentificationPlace.refresh_token !== null) {
        await this.placeModel.findByIdAndUpdate(authPlace._id, {
          token: token,
        });
        return await this.placeModel
          .findById({
            _id: authPlace._id,
          })
          .select('-password')
          .exec();
      } else {
        await this.placeModel.findByIdAndUpdate(authPlace._id, {
          token: token,
          refresh_token: refreshToken,
        });
        return await this.placeModel
          .findById({
            _id: authPlace._id,
          })
          .select('-password')
          .exec();
      }
    } catch (e) {
      throw e;
    }
  }

  async refreshAccessToken(req: any): Promise<Place> {
    try {
      const { authorization = '' } = req.headers;
      const [bearer, token] = authorization.split(' ');
      if (bearer !== 'Bearer') {
        throw new Unauthorized('jwt expired');
      }
      const SECRET_KEY = process.env.SECRET_KEY;
      const place = await this.placeModel.findOne({
        refresh_token: token,
      });
      if (!place) {
        throw new NotFound('Place not found');
      }
      const payload = {
        id: place._id,
      };
      const tokenRef = sign(payload, SECRET_KEY, { expiresIn: '24h' });
      await this.placeModel.findByIdAndUpdate(place._id, { token: tokenRef });
      const authentificationPlace = await this.placeModel
        .findById({
          _id: place.id,
        })
        .select('-password')
        .exec();
      return authentificationPlace;
    } catch (e) {
      throw e;
    }
  }
  // CATEGORY

  async findCategory(): Promise<CategoryPlace[]> {
    try {
      const find = await this.categoryModel.find().exec();
      return find;
    } catch (e) {
      throw new NotFound('User not found');
    }
  }
}

PlaceSchema.methods.setPassword = async function (password: string) {
  return (this.password = hashSync(password, 10));
};

PlaceSchema.methods.setName = function (email: string) {
  const parts = email.split('@');
  this.firstName = parts[0];
};
PlaceSchema.methods.comparePassword = function (password: string) {
  return compareSync(password, this.password);
};
