import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema, Orders } from './order.model';
import { TwilioService } from './twilio.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Orders.name, schema: OrderSchema, collection: 'orders' },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, TwilioService],
})
export class OrdersModule {}
