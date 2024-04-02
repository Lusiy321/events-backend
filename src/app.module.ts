import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { User, UserSchema } from './users/users.model';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { Category, CategorySchema } from './users/category.model';
import { OrdersModule } from './orders/orders.module';
import { OrderSchema, Orders } from './orders/order.model';
import { AdminService } from './admin/admin.service';
import { AdminController } from './admin/admin.controller';
import { AdminModule } from './admin/admin.module';
import { Admin, AdminSchema } from './admin/admin.model';
import { PostsModule } from './posts/posts.module';
import { BannersModule } from './banners/banners.module';
import {
  OrdersArchive,
  OrdersArchiveSchema,
} from './orders/order.archive.model';
import { Banner, BannerSchema } from './banners/banners.model';
import { PostSchema, Posts } from './posts/posts.model';
import { ValidationOrders } from './middleware/validation.orders';
import { ValidationUsers } from './middleware/validation.users';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { LiveModule } from './live/live.module';
import * as cors from 'cors';
import { Live, LiveSchema } from './live/live.model';
import { LiveService } from './live/live.service';
import { LiveController } from './live/live.controller';
import { BannersService } from './banners/banners.service';

@Module({
  controllers: [UsersController, AdminController, LiveController],
  providers: [UsersService, AdminService, LiveService, BannersService],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: './src/users/utils/user.gql',
      context: ({ req }) => req,
      csrfPrevention: false,
      playground: true,
    }),

    MongooseModule.forRoot(process.env.DB_HOST),
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema, collection: 'admins' },
      { name: User.name, schema: UserSchema, collection: 'users' },
      { name: Category.name, schema: CategorySchema, collection: 'categories' },
      { name: Orders.name, schema: OrderSchema, collection: 'orders' },
      { name: Banner.name, schema: BannerSchema, collection: 'banners' },
      { name: Posts.name, schema: PostSchema, collection: 'posts' },
      { name: Live.name, schema: LiveSchema, collection: 'live' },
      {
        name: OrdersArchive.name,
        schema: OrdersArchiveSchema,
        collection: 'orders-archive',
      },
    ]),
    UsersModule,
    OrdersModule,
    AdminModule,
    PostsModule,
    BannersModule,
    LiveModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ValidationOrders).forRoutes('./orders/orders.controller');
    consumer.apply(ValidationUsers).forRoutes('./users/users.controller');
    consumer.apply(cors()).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
