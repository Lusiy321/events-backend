import { Module, forwardRef } from '@nestjs/common';
import { ViberService } from './viber.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema, Orders } from 'src/orders/order.model';
import { User, UserSchema } from 'src/users/users.model';

import { TelegramModule } from 'src/telegram/telegram.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Orders.name, schema: OrderSchema, collection: 'orders' },
    ]),

    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema, collection: 'users' },
    ]),
    TelegramModule,
  ],
  providers: [ViberService],
  exports: [ViberService],
})
export class ViberModule {}
