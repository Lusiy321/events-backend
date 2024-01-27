import { Injectable } from '@nestjs/common';
import { Orders } from './order.model';
import { InjectModel } from '@nestjs/mongoose';
import { NotFound, BadRequest } from 'http-errors';
import { CreateOrderDto } from './dto/create.order.dto';
import { User } from 'src/users/users.model';
import { Categories } from 'src/users/dto/caterory.interface';
import { MesengersService } from 'src/orders/mesengers.service';
import {
  mergeAndRemoveDuplicates,
  paginateArray,
  rows,
} from 'src/users/utils/parse.user';

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
      const createdOrder = await this.ordersModel.create(params);

      await this.ordersModel.findByIdAndUpdate(
        { _id: createdOrder._id },
        { sms: verificationCode },
      );

      const order = await this.ordersModel.findById(createdOrder._id);
      const allOrders = await this.ordersModel.find({ phone: order.phone });
      if (Array.isArray(allOrders) && allOrders.length !== 0) {
        const tgChat = allOrders[0].tg_chat;
        const viber = allOrders[0].viber_chat;
        if (tgChat !== null) {
          await this.mesengersService.sendCode(tgChat);
          return order;
        } else if (viber !== null) {
          await this.mesengersService.sendCode(viber);
          return order;
        } else {
          return order;
        }
      }
      return order;
    } catch (e) {
      throw new BadRequest(e.message);
    }
  }

  async verifyOrder(code: number) {
    try {
      const order = await this.ordersModel.findOne({ sms: code });
      if (order === null) {
        throw new NotFound('Order not found');
      } else if (order.verify === false) {
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

  async searchOrders(query: any): Promise<any> {
    const { req, loc, page, cat, subcat } = query;
    try {
      const curentPage = page || 1;
      const limit = 8;
      const totalCount = await this.ordersModel.countDocuments();

      const totalPages = Math.ceil(totalCount / limit);
      const offset = (curentPage - 1) * limit;
      // Если ничего не задано в строке
      if (!req && !loc && !cat && !subcat) {
        const result = await this.ordersModel
          .find() // добавить поиск по
          .select(rows)
          .skip(offset)
          .sort({ createdAt: -1 })
          .limit(limit)
          .exec();
        return {
          totalPages: totalPages,
          currentPage: curentPage,
          data: result,
        };
      }

      const regexReq = new RegExp(req, 'i');
      const regexLoc = new RegExp(loc, 'i');
      // Если заданы пустые значения
      if (
        (req === '' && loc === '') ||
        (!req && !loc) ||
        (cat && !subcat) ||
        (!cat && subcat)
      ) {
        const category = await this.ordersModel
          .find({
            category: {
              $elemMatch: {
                _id: cat,
              },
            },
          })
          .select(rows)
          .exec();
        const subcategory = await this.ordersModel
          .find({
            'category.subcategories': {
              $elemMatch: {
                id: subcat,
              },
            },
          })
          .select(rows)
          .exec();
        const resultArray = mergeAndRemoveDuplicates(category, subcategory);
        if (Array.isArray(resultArray) && resultArray.length === 0) {
          throw new NotFound('Orders not found');
        } else {
          const result = paginateArray(resultArray, curentPage);
          const totalPages = Math.ceil(resultArray.length / limit);
          return {
            totalPages: totalPages,
            currentPage: curentPage,
            data: result,
          };
        }
      }
      // Если есть запрос без локации
      if ((req !== '' && loc === '') || !loc) {
        const findCat = await this.ordersModel
          .find({
            category: {
              $elemMatch: {
                name: { $regex: regexReq },
              },
            },
          })
          .select(rows)
          .exec();
        const findSubcat = await this.ordersModel
          .find({
            'category.subcategories': {
              $elemMatch: {
                name: { $regex: regexReq },
              },
            },
          })
          .select(rows)
          .exec();
        const findDescr = await this.ordersModel
          .find({
            description: { $regex: regexReq },
          })
          .select(rows)
          .exec();
        const category = await this.ordersModel
          .find({
            category: {
              $elemMatch: {
                _id: cat,
              },
            },
          })
          .select(rows)
          .exec();
        const subcategory = await this.ordersModel
          .find({
            'category.subcategories': {
              $elemMatch: {
                id: subcat,
              },
            },
          })
          .select(rows)
          .exec();
        const findLocation = await this.ordersModel
          .find({
            location: { $regex: regexReq },
          })
          .select(rows)
          .exec();
        const findName = await this.ordersModel
          .find({
            name: { $regex: regexReq },
          })
          .select(rows)
          .exec();

        const resultArray = mergeAndRemoveDuplicates(
          findDescr,
          category,
          subcategory,
          findCat,
          findSubcat,
          findLocation,
          findName,
        );
        if (Array.isArray(resultArray) && resultArray.length === 0) {
          throw new NotFound('Orders not found');
        } else {
          const result = paginateArray(resultArray, curentPage);
          const totalPages = Math.ceil(resultArray.length / limit);
          return {
            totalPages: totalPages,
            currentPage: curentPage,
            data: result,
          };
        }
        //Если нет запроса, но есть локация
      } else if ((req === '' && loc !== '') || !req) {
        const findLocation = await this.ordersModel
          .find({
            location: { $regex: regexLoc },
          })
          .select(rows)
          .skip(offset)
          .limit(limit)
          .exec();
        const category = await this.ordersModel
          .find({
            category: {
              $elemMatch: {
                _id: cat,
              },
            },
          })
          .select(rows)
          .exec();
        const subcategory = await this.ordersModel
          .find({
            'category.subcategories': {
              $elemMatch: {
                id: subcat,
              },
            },
          })
          .select(rows)
          .exec();

        const resultArray = mergeAndRemoveDuplicates(
          category,
          subcategory,
          findLocation,
        );

        if (Array.isArray(resultArray) && findLocation.length === 0) {
          throw new NotFound('Orders not found');
        } else {
          const result = paginateArray(resultArray, curentPage);
          const totalPages = Math.ceil(resultArray.length / limit);
          return {
            totalPages: totalPages,
            currentPage: curentPage,
            data: result,
          };
        }
      } else if (req !== '' && loc !== '') {
        const findDescr = await this.ordersModel
          .find({
            description: { $regex: regexReq },
            location: { $regex: regexLoc },
          })
          .select(rows)
          .exec();

        const category = await this.ordersModel
          .find({
            category: {
              $elemMatch: {
                _id: cat,
              },
            },
            location: { $regex: regexLoc },
          })
          .select(rows)
          .exec();

        const subcategory = await this.ordersModel
          .find({
            'category.subcategories': {
              $elemMatch: {
                id: subcat,
              },
            },
            location: { $regex: regexLoc },
          })
          .select(rows)
          .exec();
        const findCat = await this.ordersModel
          .find({
            category: {
              $elemMatch: {
                name: { $regex: regexReq },
              },
            },
            location: { $regex: regexLoc },
          })
          .select(rows)
          .exec();
        const findSubcat = await this.ordersModel
          .find({
            'category.subcategories': {
              $elemMatch: {
                name: { $regex: regexReq },
              },
            },
            location: { $regex: regexLoc },
          })
          .select(rows)
          .exec();
        const findName = await this.ordersModel
          .find({
            name: { $regex: regexReq },
            location: { $regex: regexLoc },
          })
          .select(rows)
          .exec();

        const resultArray = mergeAndRemoveDuplicates(
          findDescr,
          category,
          subcategory,
          findCat,
          findSubcat,
          findName,
        );

        if (Array.isArray(resultArray) && resultArray.length === 0) {
          throw new NotFound('Orders not found');
        } else {
          const result = paginateArray(resultArray, curentPage);
          const totalPages = Math.ceil(resultArray.length / limit);
          return {
            totalPages: totalPages,
            currentPage: curentPage,
            data: result,
          };
        }
      }
    } catch (e) {
      throw new NotFound('Orders not found');
    }
  }
}
