import { Injectable } from '@nestjs/common';
import { Orders } from './order.model';
import { InjectModel } from '@nestjs/mongoose';
import { NotFound, BadRequest, Conflict } from 'http-errors';
import { CreateOrderDto } from './dto/create.order.dto';
import { User } from 'src/users/users.model';
import { Categories } from 'src/users/dto/caterory.interface';
import { MesengersService } from 'src/orders/mesengers.service';

@Injectable()
export class OrdersService {
  constructor(
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

  async findOrderByPhone(phone: string): Promise<Orders[]> {
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

      const allOrders = await this.ordersModel.find({ phone: orderObj.phone });
      const allUsers = await this.userModel.find({ phone: orderObj.phone });

      if (
        Array.isArray(allOrders) &&
        allOrders.length === 0 &&
        Array.isArray(allUsers) &&
        allUsers.length === 0
      ) {
        console.log('tyt 3');
        const createdOrder = await this.ordersModel.create(params);
        await this.ordersModel.findByIdAndUpdate(
          { _id: createdOrder._id },
          { sms: verificationCode },
        );
        return await this.ordersModel.findById({ _id: createdOrder._id });
      } else if (
        (Array.isArray(allOrders) && allOrders.length !== 0) ||
        (Array.isArray(allUsers) && allUsers.length !== 0)
      ) {
        if (allOrders.length !== 0) {
          console.log('tyt 2');
          const tgChat = allOrders[allOrders.length - 1].tg_chat;
          const viber = allOrders[allOrders.length - 1].viber_chat;
          const sms = allOrders[allOrders.length - 1].sms;

          if (tgChat === null && viber === null && sms !== null) {
            throw Conflict('Ви не активували бот');
          }
          if (
            (tgChat !== null && sms !== null) ||
            (viber !== null && sms !== null)
          ) {
            throw Conflict('Ви не підтвердили попередній запит');
          }
          if (tgChat !== null) {
            const createdOrder = await this.ordersModel.create(params);
            createdOrder.tg_chat = tgChat;
            createdOrder.sms = verificationCode;
            createdOrder.save();

            await this.mesengersService.sendCode(tgChat, verificationCode);
            return await this.ordersModel.findById({ _id: createdOrder._id });
          }

          if (viber !== null) {
            const createdOrder = await this.ordersModel.create(params);
            createdOrder.viber_chat = viber;
            createdOrder.sms = verificationCode;
            createdOrder.save();
            await this.mesengersService.sendCode(viber, verificationCode);
            return await this.ordersModel.findById({ _id: createdOrder._id });
          }
        }
        if (allUsers.length !== 0) {
          const u_tgChat = allUsers[0].tg_chat;
          const u_viber = allUsers[0].viber_chat;
          if (u_tgChat !== null) {
            console.log('tyt 1');
            const createdOrder = await this.ordersModel.create(params);
            createdOrder.tg_chat = u_tgChat;
            createdOrder.sms = verificationCode;
            createdOrder.save();

            await this.mesengersService.sendCode(u_tgChat, verificationCode);
            return await this.ordersModel.findById({ _id: createdOrder._id });
          }
          if (u_viber !== null) {
            const createdOrder = await this.ordersModel.create(params);
            createdOrder.viber_chat = u_viber;
            createdOrder.sms = verificationCode;
            createdOrder.save();
            await this.mesengersService.sendCode(u_viber, verificationCode);
            return await this.ordersModel.findById({ _id: createdOrder._id });
          }
        }
      } else {
        throw new BadRequest('Order not found');
      }
    } catch (e) {
      throw e;
    }
  }

  async verifyOrder(code: number) {
    try {
      const order = await this.ordersModel.findOne({ sms: code });
      if (order === null) {
        throw new NotFound('Order not found');
      }
      if (order.verify === false) {
        await this.ordersModel.findByIdAndUpdate(
          { _id: order._id },
          { verify: true, sms: null },
        );

        const usersArr = await this.findUserByCategory(order);
        const sendMessagePromises = usersArr.map(
          async (user: {
            tg_chat: number;
            _id: string;
            viber_chat: string;
          }) => {
            if (user.tg_chat !== null) {
              const check = await this.checkTrialStatus(user._id);
              if (check === true) {
                await this.mesengersService.sendNewTgOrder(user.tg_chat, order);
              }
            }
            if (user.viber_chat !== null) {
              const check = await this.checkTrialStatus(user._id);
              if (check === true) {
                await this.mesengersService.sendNewViberOrder(
                  user.viber_chat,
                  order,
                );
              }
            }
          },
        );
        await Promise.all(sendMessagePromises);
        if (usersArr.length !== 0) {
          const message = `Ваше замовлення було успішно опубліковано. По вашим параметрам знайшлося ${usersArr.length} виконавців.`;
          if (order.tg_chat !== null) {
            await this.mesengersService.sendMessageTg(order.tg_chat, message);
          } else if (order.viber_chat !== null) {
            await this.mesengersService.sendMessageViber(
              order.viber_chat,
              message,
            );
          }
          return usersArr;
        } else {
          const message =
            'На жаль, ніхто не підійшов під ваше замовлення. Спробуйте пізніше або виконайте пошук самостійно https://www.wechirka.com/artists';

          if (order.tg_chat !== null) {
            await this.mesengersService.sendMessageTg(order.tg_chat, message);
          } else if (order.viber_chat !== null) {
            await this.mesengersService.sendMessageViber(
              order.viber_chat,
              message,
            );
          }

          return usersArr;
        }
      } else {
        throw new BadRequest('Order not found');
      }
    } catch (e) {
      if (e.message === 'ETELEGRAM: 400 Bad Request: chat not found') {
        return [];
      }
      throw e;
    }
  }

  async checkTrialStatus(id: string): Promise<boolean> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFound('User not found');
    }

    if (user.trialEnds > new Date() || user.paidEnds > new Date()) {
      return true;
    } else {
      user.trial = false;
      user.paid = false;
      await user.save();
      return false;
    }
  }

  async findUserByCategory(order: Orders) {
    const orderCategories = order.category;

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
    const subcategoriesId = extractIds(orderCategories);
    const findId = subcategoriesId[0];
    const subcategory = await this.userModel
      .find({
        'category.subcategories': {
          $elemMatch: {
            id: findId,
          },
        },
        location: order.location,
      })
      .exec();
    if (Array.isArray(subcategory) && subcategory.length === 0) {
      const [city, region, country] = order.location.split(', ');
      if (country === undefined) {
        const regexLocation = new RegExp('Київська область', 'i');
        const category = await this.userModel
          .find({
            'category.subcategories': {
              $elemMatch: {
                id: findId,
              },
            },
            location: { $regex: regexLocation },
          })
          .exec();
        return category;
      } else {
        const regexLocation = new RegExp(region, 'i');
        const category = await this.userModel
          .find({
            'category.subcategories': {
              $elemMatch: {
                id: findId,
              },
            },
            location: { $regex: regexLocation },
          })
          .exec();
        return category;
      }
    }
    return subcategory;
  }
}
