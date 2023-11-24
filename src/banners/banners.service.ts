import { Injectable } from '@nestjs/common';
import { Banner } from './banners.model';
import { InjectModel } from '@nestjs/mongoose';
import { CreateBannerDto } from './dto/create.banners.dto';
import { Conflict, NotFound, BadRequest, Unauthorized } from 'http-errors';

@Injectable()
export class BannersService {
  constructor(
    @InjectModel(Banner.name)
    private bannerModel: Banner,
  ) {}

  async createBanner(banner: CreateBannerDto, req: any): Promise<Banner> {
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
}
