import { Module } from '@nestjs/common';
import { ViberService } from './viber.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema, Orders } from 'src/orders/order.model';
import { User, UserSchema } from 'src/users/users.model';
import { Viber, ViberSchema } from './viber.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Orders.name, schema: OrderSchema, collection: 'orders' },
    ]),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema, collection: 'users' },
    ]),
  ],
  providers: [ViberService],
  exports: [ViberService],
})
export class ViberModule {}
