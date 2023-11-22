import { Injectable } from '@nestjs/common';
import { Orders } from './order.model';
import { InjectModel } from '@nestjs/mongoose';
import { Conflict, NotFound, BadRequest, Unauthorized } from 'http-errors';
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
      throw new NotFound('User not found');
    }
  }

  async findOrderById(id: string): Promise<Orders> {
    try {
      const find = await this.ordersModel.findById({ _id: id }).exec();
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
        const order = await this.ordersModel.findById(createdOrder._id);
        const usersArr = await this.findUserByCategory(order);

        for (const user of usersArr) {
          if (user.tg_chat !== null || user.viber !== null) {
            await this.mesengersService.sendNewTgOrder(user.tg_chat, order);
            await this.mesengersService.sendNewViberOrder(user.viber, order);
          }
        }

        // await this.twilioService.sendSMS(
        //   order.phone,
        //   `Your verification code: ${order.sms}`,
        // );
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
