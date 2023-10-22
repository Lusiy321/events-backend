import { Injectable } from '@nestjs/common';
import { Orders } from './order.model';
import { InjectModel } from '@nestjs/mongoose';
import { Conflict, NotFound, BadRequest, Unauthorized } from 'http-errors';
import { CreateOrderDto } from './dto/create.order.dto';
import { TwilioService } from './twilio.service';

import { TelegramService } from 'src/telegram/telegram.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly twilioService: TwilioService,
    private readonly telegramService: TelegramService,
    @InjectModel(Orders.name)
    private ordersModel: Orders,
  ) {}

  async findAllOrders(): Promise<Orders[]> {
    try {
      const find = await this.ordersModel.find().exec();
      return find;
    } catch (e) {
      throw new NotFound('User not found');
    }
  }

  async findOrderByPhone(phone: string): Promise<Orders> {
    try {
      const find = await this.ordersModel.findOne({ phone: phone }).exec();
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
      const { ...params } = order;

      const existingOrder = await this.ordersModel.findOne({
        phone: order.phone,
        active: true,
      });

      if (existingOrder) {
        throw new Conflict(
          `Пользователь с номером телефона ${order.phone} уже существует`,
        );
      } else {
        const verificationCode = await this.generateSixDigitNumber();
        const createdOrder = await this.ordersModel.create(params);

        await this.ordersModel.findByIdAndUpdate(
          { _id: createdOrder._id },
          { sms: verificationCode },
        );
        const user = await this.ordersModel.findById(createdOrder._id);

        const chatId = '609689270';
        await this.telegramService.sendNewOrder(chatId, user);
        await this.twilioService.sendSMS(
          user.phone,
          `Your verification code: ${user.sms}`,
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
