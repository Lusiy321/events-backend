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

  async create(order: CreateOrderDto): Promise<Orders> {
    try {
      const { phone } = order;

      const registrationUser = await this.ordersModel.findOne({
        phone: phone,
      });
      if (registrationUser.active === true) {
        throw new Conflict(`User with ${phone} in use`);
      }

      const createOrder = await this.ordersModel.create(order);
      createOrder.save();

      return await this.ordersModel.findById(createOrder._id);
    } catch (e) {
      throw new BadRequest(e.message);
    }
  }

  async sendVerificationCode(phoneNumber: CreateOrderDto) {
    // const user = await this.ordersModel.findOne(phoneNumber);
    const { phone } = phoneNumber;
    function generateSixDigitNumber() {
      const min = 100000;
      const max = 999999;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const verificationCode = generateSixDigitNumber();
    console.log(phone);
    // try {
    await this.twilioService.sendSMS(
      phone,
      `Your verification code: ${verificationCode}`,
    );

    // await this.ordersModel.findByIdAndUpdate(
    //   { _id: user._id },
    //   { sms: verificationCode },
    // );
    // } catch (e) {
    //   throw new BadRequest(e.message);
    // }
    return await this.ordersModel.findOne(phoneNumber);
  }
}
