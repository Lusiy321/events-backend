import { Module } from '@nestjs/common';
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

@Module({
  controllers: [UsersController, AdminController],
  providers: [UsersService, AdminService],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
    }),
    MongooseModule.forRoot(process.env.DB_HOST),
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema, collection: 'admins' },
      { name: User.name, schema: UserSchema, collection: 'users' },
      { name: Category.name, schema: CategorySchema, collection: 'categories' },
      { name: Orders.name, schema: OrderSchema, collection: 'orders' },
      { name: Banner.name, schema: BannerSchema, collection: 'banners' },
      { name: Posts.name, schema: PostSchema, collection: 'posts' },

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
  ],
})
export class AppModule {}
