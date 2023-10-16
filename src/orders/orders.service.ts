import { Injectable } from '@nestjs/common';
import { Orders } from './order.model';
import { InjectModel } from '@nestjs/mongoose';
import { Conflict, NotFound, BadRequest, Unauthorized } from 'http-errors';
import { CreateOrderDto } from './dto/create.order.dto';

@Injectable()
export class OrdersService {
  twilioService: any;
  constructor(
    @InjectModel(Orders.name)
    private ordersModel: Orders,
  ) {}

  async findOrderByPhone(phone: string): Promise<Orders> {
    try {
      const find = await this.ordersModel.findOne(phone).exec();
      return find;
    } catch (e) {
      throw new NotFound('User not found');
    }
  }
  async generateSixDigitNumber() {
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  async create(order: CreateOrderDto): Promise<Orders> {
    try {
      const { phone } = order;

      const existingOrder = await this.ordersModel.findOne({
        phone: phone,
        active: true,
      });

      if (existingOrder) {
        throw new Conflict(
          `Пользователь с номером телефона ${phone} уже существует`,
        );
      } else {
        const verificationCode = await this.generateSixDigitNumber();
        const createdOrder = await this.ordersModel.create(order);

        await this.ordersModel.findByIdAndUpdate(
          { _id: createdOrder._id },
          { sms: verificationCode },
        );

        return await this.ordersModel.findById(createdOrder._id);
      }
    } catch (e) {
      throw new BadRequest(e.message);
    }
  }

  async verifyOrder(code: string) {
    try {
      const user = await this.ordersModel.findOne({ sms: code });
      if (user) {
        user.verify = true;
        user.save();
        return await this.ordersModel.findOne({ id: user.id });
      }
    } catch (e) {
      throw new BadRequest(e.message);
    }
  }
}
