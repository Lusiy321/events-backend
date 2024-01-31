import { Module } from '@nestjs/common';
import { BannersService } from './banners.service';
import { BannersController } from './banners.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Banner, BannerSchema } from './banners.model';
import { User, UserSchema } from 'src/users/users.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Banner.name, schema: BannerSchema, collection: 'banners' },
      { name: User.name, schema: UserSchema, collection: 'users' },
    ]),
  ],
  providers: [BannersService],
  controllers: [BannersController],
})
export class BannersModule {}
