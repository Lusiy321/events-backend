import { Module } from '@nestjs/common';
import { TRANSPORTER_PROVIDER, UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users.model';
import { JwtModule } from '@nestjs/jwt';
import { GoogleStrategy } from './utils/GoogleStrategy';
import { SessionSerializer } from './utils/Serializer';
import { Category, CategorySchema } from './category.model';
import { CloudinaryService } from './cloudinary.service';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { FacebookStrategy } from './utils/FacebookStrategy';
import * as nodemailer from 'nodemailer';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '1day' },
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema, collection: 'users' },
      { name: Category.name, schema: CategorySchema, collection: 'categories' },
    ]),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  providers: [
    GoogleStrategy,
    FacebookStrategy,
    SessionSerializer,
    { provide: 'USER_SERVICE', useClass: UsersService },
    UsersService,
    CloudinaryService,
    ConfigService,
    {
      provide: TRANSPORTER_PROVIDER,
      useFactory: () => {
        return nodemailer.createTransport({
          host: 'smtp.zoho.eu',
          port: 465,
          secure: true,
          auth: {
            user: process.env.NOREPLY_MAIL,
            pass: process.env.NOREPLY_PASSWORD,
          },
        });
      },
    },
  ],
  exports: [UsersService, CloudinaryService, TRANSPORTER_PROVIDER],
  controllers: [UsersController],
})
export class UsersModule {}
