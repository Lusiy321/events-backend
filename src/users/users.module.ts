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
import { SearchService } from './search.service';
import { OrderSchema, Orders } from 'src/orders/order.model';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UsersResolver } from './users.resolver';
import { DirectiveLocation, GraphQLDirective } from 'graphql';
import { join } from 'path';
import { Place, PlaceSchema } from 'src/places/places.model';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '1day' },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/users/utils/user.gql'),
      context: ({ req }) => req,
      csrfPrevention: false,
      introspection: true,
      installSubscriptionHandlers: true,
      playground: true,
      buildSchemaOptions: {
        directives: [
          new GraphQLDirective({
            name: 'upper',
            locations: [DirectiveLocation.FIELD_DEFINITION],
          }),
        ],
      },
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema, collection: 'users' },
      { name: Orders.name, schema: OrderSchema, collection: 'orders' },
      { name: Category.name, schema: CategorySchema, collection: 'categories' },
      { name: Place.name, schema: PlaceSchema, collection: 'places' },
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
    SearchService,
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
    UsersResolver,
  ],
  exports: [
    UsersService,
    CloudinaryService,
    TRANSPORTER_PROVIDER,
    SearchService,
  ],
  controllers: [UsersController],
})
export class UsersModule {}
