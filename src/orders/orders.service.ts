import { Injectable } from '@nestjs/common';
import { Orders } from './order.model';
import { InjectModel } from '@nestjs/mongoose';
import { NotFound, BadRequest } from 'http-errors';
import { CreateOrderDto } from './dto/create.order.dto';
import { TwilioService } from './twilio.service';
import { User } from 'src/users/users.model';
import { Categories } from 'src/users/dto/caterory.interface';
import { MesengersService } from 'src/orders/mesengers.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly twilioService: TwilioService,
    private readonly mesengersService: MesengersService,
    @InjectModel(Orders.name)
    private ordersModel: Orders,
    @InjectModel(User.name)
    private userModel: User,
  ) {}

  async findAllOrders(): Promise<Orders[]> {
    try {
      const find = await this.ordersModel.find().exec();
      return find;
    } catch (e) {
      throw new NotFound('Order not found');
    }
  }

  async findOrderById(id: string): Promise<Orders> {
    try {
      const find = await this.ordersModel.findById({ _id: id }).exec();
      return find;
    } catch (e) {
      throw new NotFound('Order not found');
    }
  }

  async findOrderByPhone(phone: string): Promise<Orders> {
    try {
      const find = await this.ordersModel.findOne({ phone: phone }).exec();
      return find;
    } catch (e) {
      throw new NotFound('Order not found');
    }
  }

  async generateSixDigitNumber() {
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async create(orderObj: CreateOrderDto): Promise<Orders> {
    try {
      const { ...params } = orderObj;

      const verificationCode = await this.generateSixDigitNumber();
      const createdOrder = await this.ordersModel.create(params);

      await this.ordersModel.findByIdAndUpdate(
        { _id: createdOrder._id },
        { sms: verificationCode },
      );

      const order = await this.ordersModel.findById(createdOrder._id);
      // const phone = '+' + order.phone;
      // await this.twilioService.sendSMS(
      //   phone,
      //   `Your verification code Wechirka.com: ${order.sms}`,
      // );

      return order;
    } catch (e) {
      throw new BadRequest(e.message);
    }
  }

  async verifyOrder(code: string) {
    try {
      const order = await this.ordersModel.findOne({ sms: code });
      if (order) {
        order.verify = true;
        const updatedOrder = await this.ordersModel.findByIdAndUpdate(
          { _id: order._id },
          { verify: true },
        );

        const usersArr = await this.findUserByCategory(order);

        for (const user of usersArr) {
          if (user.tg_chat !== null && user.location === order.location) {
            const check = await this.checkTrialStatus(user._id);
            if (check === true || user.paid === true) {
              await this.mesengersService.sendNewTgOrder(user.tg_chat, order);
            }
          }
        }

        for (const user of usersArr) {
          if (user.viber !== null && user.location === order.location) {
            const check = await this.checkTrialStatus(user._id);
            if (check === true || user.paid === true) {
              await this.mesengersService.sendNewViberOrder(user.viber, order);
            }
          }
        }
        return updatedOrder;
      }
    } catch (e) {
      throw new BadRequest(e.message);
    }
  }

  async checkTrialStatus(id: string): Promise<boolean> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFound('User not found');
    }

    if (user.trial && user.trialEnds > new Date()) {
      return true;
    } else {
      user.trial = false;
      await user.save();
      return false;
    }
  }

  async findUserByCategory(order: Orders) {
    const arr = order.category;

    function extractIds(data: Categories[]) {
      const ids = [];

      function recursiveExtract(obj: Object) {
        for (const key in obj) {
          if (key === 'id') {
            ids.push(obj[key]);
          } else if (typeof obj[key] === 'object') {
            recursiveExtract(obj[key]);
          }
        }
      }

      recursiveExtract(data);
      return ids;
    }
    const subcategoriesId = extractIds(arr);
    const findId = subcategoriesId[0];
    const subcategory = await this.userModel
      .find({
        'category.subcategories': {
          $elemMatch: {
            id: findId,
          },
        },
      })
      .exec();

    return subcategory;
  }
}
