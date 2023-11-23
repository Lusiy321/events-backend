import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema, Orders } from './order.model';
import { TwilioService } from './twilio.service';
import { User, UserSchema } from 'src/users/users.model';
import { MesengersService } from './mesengers.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Orders.name, schema: OrderSchema, collection: 'orders' },
      { name: User.name, schema: UserSchema, collection: 'users' },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, TwilioService, MesengersService],
})
export class OrdersModule {}
