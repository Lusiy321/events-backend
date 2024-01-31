import { Injectable } from '@nestjs/common';
import { Banner } from './banners.model';
import { InjectModel } from '@nestjs/mongoose';
import { CreateBannerDto } from './dto/create.banners.dto';
import { Conflict, NotFound, BadRequest, Unauthorized } from 'http-errors';
import { User } from 'src/users/users.model';

@Injectable()
export class BannersService {
  constructor(
    @InjectModel(Banner.name)
    private bannerModel: Banner,
    @InjectModel(User.name)
    private userModel: User,
  ) {}

  async createBanner(banner: CreateBannerDto): Promise<Banner> {
    try {
      const creat = await this.bannerModel.create(banner);
      creat.save();

      return await this.bannerModel.findById(creat._id);
    } catch (e) {
      throw new BadRequest(e.message);
    }
  }

  async findAllBanners(): Promise<Banner[]> {
    try {
      const find = await this.bannerModel.find().exec();
      return find;
    } catch (e) {
      throw new NotFound('Banners not found');
    }
  }

  async findBannerById(id: string): Promise<Banner> {
    try {
      const find = await this.bannerModel.findById(id).exec();
      return find;
    } catch (e) {
      throw new NotFound('Banner not found');
    }
  }

  async deleteBanner(id: string): Promise<Banner> {
    try {
      const find = await this.bannerModel.findByIdAndRemove(id).exec();
      return find;
    } catch (e) {
      throw new NotFound('Banner not found');
    }
  }

  async updateBanner(id: string, data: CreateBannerDto): Promise<Banner> {
    try {
      const { ...params } = data;
      const find = await this.bannerModel
        .findByIdAndUpdate(
          { _id: id },
          {
            ...params,
          },
        )
        .exec();
      return find;
    } catch (e) {
      throw new NotFound('Banner not found');
    }
  }

  async getRightBanner(): Promise<Object[]> {
    try {
      const music = await this.userModel
        .aggregate([
          { $unwind: '$category' },
          {
            $match: {
              'category._id': '65258a576f9a7d99e555c7bd',
            },
          },
          { $match: { verify: true } },
          { $sample: { size: 3 } },
        ])
        .exec();
      const animators = await this.userModel
        .aggregate([
          { $unwind: '$category' },
          {
            $match: {
              'category._id': '65258abb6f9a7d99e555c7ce',
            },
          },
          { $match: { verify: true } },
          { $sample: { size: 3 } },
        ])
        .exec();
      const photo = await this.userModel
        .aggregate([
          { $unwind: '$category' },
          {
            $match: {
              'category._id': '65258b446f9a7d99e555c7e2',
            },
          },
          { $match: { verify: true } },
          { $sample: { size: 3 } },
        ])
        .exec();
      const decorations = await this.userModel
        .aggregate([
          { $unwind: '$category' },
          {
            $match: {
              'category._id': '65258b9d6f9a7d99e555c7f3',
            },
          },
          { $match: { verify: true } },
          { $sample: { size: 3 } },
        ])
        .exec();
      const catering = await this.userModel
        .aggregate([
          { $unwind: '$category' },
          {
            $match: {
              'category._id': '65258c516f9a7d99e555c804',
            },
          },
          { $match: { verify: true } },
          { $sample: { size: 3 } },
        ])
        .exec();
      const rent = await this.userModel
        .aggregate([
          { $unwind: '$category' },
          {
            $match: {
              'category._id': '65258ca76f9a7d99e555c815',
            },
          },
          { $match: { verify: true } },
          { $sample: { size: 3 } },
        ])
        .exec();
      const organ = await this.userModel
        .aggregate([
          { $unwind: '$category' },
          {
            $match: {
              'category._id': '65258cf26f9a7d99e555c826',
            },
          },
          { $match: { verify: true } },
          { $sample: { size: 3 } },
        ])
        .exec();
      const corporative = await this.userModel
        .aggregate([
          { $unwind: '$category' },
          {
            $match: {
              'category._id': '6525924f78a57a652732329d',
            },
          },
          { $match: { verify: true } },
          { $sample: { size: 3 } },
        ])
        .exec();
      const weddings = await this.userModel
        .aggregate([
          { $unwind: '$category' },
          {
            $match: {
              'category._id': '6525934f78a57a65273232b1',
            },
          },
          { $match: { verify: true } },
          { $sample: { size: 3 } },
        ])
        .exec();

      return [
        { id: 1, name: 'Музичні послуги', data: music },
        { id: 2, name: 'Анімаційні послуги', data: animators },
        { id: 3, name: 'Фото та відео', data: photo },
        { id: 4, name: 'Декорації та дизайн', data: decorations },
        { id: 5, name: 'Кейтеринг та розваги', data: catering },
        { id: 6, name: 'Оренда обладнання', data: rent },
        { id: 7, name: 'Послуги організації', data: organ },
        { id: 8, name: 'Корпоративні заходи', data: corporative },
        { id: 9, name: 'Весілля та ювілеї', data: weddings },
      ];
    } catch (e) {
      throw new NotFound(`Banner not found: ${e}`);
    }
  }
}
