import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema, Orders } from './order.model';
import { User, UserSchema } from 'src/users/users.model';
import { MesengersService } from './mesengers.service';
import { OrdersArchive, OrdersArchiveSchema } from './order.archive.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Orders.name, schema: OrderSchema, collection: 'orders' },
      { name: User.name, schema: UserSchema, collection: 'users' },
      {
        name: OrdersArchive.name,
        schema: OrdersArchiveSchema,
        collection: 'orders-archive',
      },
    ]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, MesengersService],
})
export class OrdersModule {}
