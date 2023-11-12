import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { User, UserSchema } from './users/users.model';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { Category, CategorySchema } from './users/category.model';
import { TelegramService } from './telegram/telegram.service';
import { TelegramModule } from './telegram/telegram.module';
import { OrdersModule } from './orders/orders.module';
import { OrderSchema, Orders } from './orders/order.model';
import { HttpModule } from '@nestjs/axios';
import { AdminService } from './admin/admin.service';
import { AdminController } from './admin/admin.controller';
import { AdminModule } from './admin/admin.module';
import { Admin, AdminSchema } from './admin/admin.model';
import { ViberService } from './viber/viber.service';
import { ViberModule } from './viber/viber.module';
import { PostsModule } from './posts/posts.module';

@Module({
  controllers: [UsersController, AdminController],
  providers: [UsersService, TelegramService, AdminService, ViberService],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
    }),
    MongooseModule.forRoot(process.env.DB_HOST),
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema, collection: 'admins' },
    ]),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema, collection: 'users' },
    ]),
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema, collection: 'categories' },
    ]),
    MongooseModule.forFeature([
      { name: Orders.name, schema: OrderSchema, collection: 'orders' },
    ]),
    UsersModule,
    TelegramModule,
    OrdersModule,
    AdminModule,
    ViberModule,
    PostsModule,
  ],
})
export class AppModule {}
