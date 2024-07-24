import { Module } from '@nestjs/common';
import { PlacesService, TRANSPORTER_PROVIDER } from './places.service';
import { PlacesController } from './places.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Place, PlaceSchema } from './places.model';
import { CloudinaryService } from 'src/users/cloudinary.service';
import * as nodemailer from 'nodemailer';
import { User, UserSchema } from 'src/users/users.model';
import { CategoryPlace, CategoryPlaceSchema } from './category.place.model';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '1day' },
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema, collection: 'users' },
      { name: Place.name, schema: PlaceSchema, collection: 'places' },
      {
        name: CategoryPlace.name,
        schema: CategoryPlaceSchema,
        collection: 'place-categories',
      },
    ]),
  ],
  providers: [
    PlacesService,
    CloudinaryService,
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
  controllers: [PlacesController],
})
export class PlacesModule {}
