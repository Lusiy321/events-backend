import { Module } from '@nestjs/common';
import { BannersService } from './banners.service';
import { BannersController } from './banners.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Banner, BannerSchema } from './banners.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Banner.name, schema: BannerSchema, collection: 'banners' },
    ]),
  ],
  providers: [BannersService],
  controllers: [BannersController],
})
export class BannersModule {}
