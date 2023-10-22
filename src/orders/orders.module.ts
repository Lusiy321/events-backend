import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema, Orders } from './order.model';
import { TwilioService } from './twilio.service';
import { TelegramService } from 'src/telegram/telegram.service';
import { TelegramModule } from 'src/telegram/telegram.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Orders.name, schema: OrderSchema, collection: 'orders' },
    ]),
    TelegramModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, TwilioService],
})
export class OrdersModule {}
