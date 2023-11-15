import { Module, forwardRef } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema, Orders } from './order.model';
import { TwilioService } from './twilio.service';
import { TelegramModule } from 'src/telegram/telegram.module';
import { User, UserSchema } from 'src/users/users.model';
import { ViberModule } from 'src/viber/viber.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Orders.name, schema: OrderSchema, collection: 'orders' },
    ]),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema, collection: 'users' },
    ]),
    TelegramModule,
    ViberModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, TwilioService],
})
export class OrdersModule {}
