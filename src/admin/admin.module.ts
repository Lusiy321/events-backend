import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './admin.model';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { JwtModule } from '@nestjs/jwt';
import { User, UserSchema } from 'src/users/users.model';
import { OrderSchema, Orders } from 'src/orders/order.model';
import { UsersService } from 'src/users/users.service';
import { Category, CategorySchema } from 'src/users/category.model';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '1day' },
    }),
    MongooseModule.forFeature([
      { name: Admin.name, schema: AdminSchema, collection: 'admins' },
      { name: Category.name, schema: CategorySchema, collection: 'categories' },
      { name: User.name, schema: UserSchema, collection: 'users' },
      { name: Orders.name, schema: OrderSchema, collection: 'orders' },
    ]),
  ],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
