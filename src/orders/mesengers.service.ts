import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as TelegramBot from 'node-telegram-bot-api';
import { InlineKeyboardMarkup } from 'node-telegram-bot-api';
export const ViberBot = require('viber-bot').Bot;
const TextMessage = require('viber-bot').Message.Text;
const RichMediaMessage = require('viber-bot').Message.RichMedia;
const KeyboardMessage = require('viber-bot').Message.Keyboard;
const PictureMessage = require('viber-bot').Message.Picture;
import { User } from 'src/users/users.model';
import { Orders } from 'src/orders/order.model';

import * as ngrok from '@ngrok/ngrok';

const MAIN_KEYBOARD = {
  Type: 'keyboard',
  Revision: 1,
  ButtonsGroupColumns: 3,
  ButtonsGroupRows: 1,
  Buttons: [
    {
      ActionType: 'open-url',
      ActionBody: 'https://www.wechirka.com',
      Text: '<font color="#FFFFFF" size="5">Перейти на наш сайт</font>',
      TextSize: 'regular',
      TextVAlign: 'middle',
      TextHAlign: 'center',
      BgColor: '#094356',
    },
    {
      ActionType: 'reply',
      ActionBody: `orders`,
      Text: '<font color="#FFFFFF" size="5">Мої заявки (лише для замовників)</font>',
      TextSize: 'regular',
      TextVAlign: 'middle',
      TextHAlign: 'center',
      BgColor: '#094356',
    },
    {
      ActionType: 'reply',
      ActionBody: `review`,
      Text: '<font color="#FFFFFF" size="5">Мої відгуки (лише для виконавців)</font>',
      TextSize: 'regular',
      TextVAlign: 'middle',
      TextHAlign: 'center',
      BgColor: '#094356',
    },
  ],
};

@Injectable()
export class MesengersService {
  private viber_bot: typeof ViberBot;
  private tg_bot: TelegramBot;
  constructor(
    @InjectModel(Orders.name)
    private ordersModel: Orders,
    @InjectModel(User.name)
    private userModel: User,
  ) {
    // VIBER BOT CODE START
    this.viber_bot = new ViberBot({
      authToken: process.env.VIBER_ACCESS_TOKEN,
      name: 'Wechirka',
      avatar:
        'https://res.cloudinary.com/dciy3u6un/image/upload/v1701947849/service/paanrsds5krezvpreog0.webp',
    });

    // MSG ON BOT STARTED
    this.viber_bot.onSubscribe(async (response: any) => {
      say(
        response,
        `Привіт ${response.userProfile.name}. Я бот ресурсу ${this.viber_bot.name}! Щоб отримувати сповіщеня, відправте свій номер телефону у форматі 380981231122.\n\nСюди, Вам будуть надходити сповіщеня про замовлення або пропозиції від виконавців.`,
      );
    });

    function say(response: any, message: any) {
      response.send(
        new KeyboardMessage(MAIN_KEYBOARD),
        new TextMessage(message),
      );
    }
    //MAIN FUNCTION
    this.viber_bot.onTextMessage(/./, async (msg: any, res: any) => {
      try {
        const userProfile = res.userProfile.name;
        const userId = res.userProfile.id;

        const MAIN_KEYBOARD = {
          Type: 'keyboard',
          Revision: 1,
          ButtonsGroupColumns: 3,
          ButtonsGroupRows: 1,
          Buttons: [
            {
              ActionType: 'open-url',
              ActionBody: 'https://www.wechirka.com',
              Text: '<font color="#FFFFFF" size="5">Перейти на наш сайт</font>',
              TextSize: 'large',
              TextVAlign: 'middle',
              TextHAlign: 'center',
              BgColor: '#094356',
            },
            {
              ActionType: 'reply',
              ActionBody: `orders:${userProfile}:${userId}`,
              Text: '<font color="#FFFFFF" size="5">Мої заявки (лише для замовників)</font>',
              TextSize: 'large',
              TextVAlign: 'middle',
              TextHAlign: 'center',
              BgColor: '#094356',
            },
            {
              ActionType: 'reply',
              ActionBody: `review:${userProfile}:${userId}`,
              Text: '<font color="#FFFFFF" size="5">Мої відгуки (лише для виконавців)</font>',
              TextSize: 'regular',
              TextVAlign: 'middle',
              TextHAlign: 'center',
              BgColor: '#094356',
            },
          ],
        };
        this.viber_bot.sendMessage(
          { id: res.userProfile.id },
          new KeyboardMessage(MAIN_KEYBOARD),
        );
        const messageText = msg.text;

        const phoneNumber = parseInt(messageText);
        const actionBody = msg.text;
        const [action, phone, chatId] = actionBody.split(':');

        switch (action) {
          case 'accept':
            await this.sendViberAgreement(phone, chatId);
            break;

          case 'disagree':
            const user = await this.userModel.findOne({ viber: chatId });
            user.disagree_order += 1;
            await this.userModel.findByIdAndUpdate(user.id, {
              disagree_order: user.disagree_order,
            });
            say(res, 'Ви не погодились на пропозицію.');
            break;
          case 'orders':
            await this.myOrdersList(chatId);
            break;
          case 'review':
            await this.myReviewList(chatId);
            break;
          case 'delete':
            const delOrder = await this.ordersModel.findById(phone);
            this.viber_bot.sendMessage({ id: chatId }, [
              new TextMessage(
                `Ви видалили замевлення: ${delOrder.description}.`,
              ),
              new KeyboardMessage(MAIN_KEYBOARD),
            ]);
            await this.userModel.updateMany(
              { accepted_orders: phone },
              { $pull: { accepted_orders: phone } },
            );
            await this.ordersModel.findByIdAndRemove(phone);
            break;
          case 'active':
            const actiOrder = await this.ordersModel.findById(phone);
            await this.ordersModel.findByIdAndUpdate(actiOrder.id, {
              active: true,
            });
            this.viber_bot.sendMessage({ id: chatId }, [
              new TextMessage(
                `Ви активували замевлення: ${actiOrder.description}.`,
              ),
              new KeyboardMessage(MAIN_KEYBOARD),
            ]);
            break;
          case 'deactive':
            const deactiOrder = await this.ordersModel.findById(phone);
            await this.ordersModel.findByIdAndUpdate(deactiOrder.id, {
              active: false,
            });
            this.viber_bot.sendMessage({ id: chatId }, [
              new TextMessage(
                `Ви деактивували замевлення: ${deactiOrder.description}.`,
              ),
              new KeyboardMessage(MAIN_KEYBOARD),
            ]);
            break;
          case 'users':
            const findOrder = await this.ordersModel.findOne({ _id: phone });

            findOrder.accepted_users.map(async (user: any) => {
              const findedUser = await this.userModel.findOne({ _id: user });
              const msgOrder = `Замовлення:\n${findOrder.description}\nКористувач: ${findedUser.firstName}.\nКатегорія: ${findedUser.category[0].subcategories[0].name}\nОплата: ${findedUser.price}\nТелефон: +${findedUser.phone}.\nПосилання на профіль:\n${process.env.FRONT_LINK}artists/${findedUser._id}.`;
              this.viber_bot.sendMessage({ id: chatId }, [
                new TextMessage(msgOrder),
                new KeyboardMessage(MAIN_KEYBOARD),
              ]);
            });
            break;
          default:
            break;
        }

        if (!isNaN(phoneNumber) && phoneNumber.toString().length === 12) {
          const user = await this.userModel.findOne({ phone: phoneNumber });
          const order = await this.ordersModel.findOne({
            phone: phoneNumber,
          });

          if (
            (user && user.viber === null) ||
            (order && order.viber === null)
          ) {
            const updatedUser = await this.userModel.findByIdAndUpdate(
              { _id: user.id },
              {
                viber: res.userProfile.id,
              },
            );
            const updatedOrder = await this.ordersModel.findByIdAndUpdate(
              { _id: order.id },
              {
                viber: res.userProfile.id,
              },
            );
            await updatedUser.save();
            await updatedOrder.save();

            this.viber_bot.sendMessage({ id: res.userProfile.id }, [
              new TextMessage(
                `Дякую, ${res.userProfile.name} теперь Вам будуть надходити сповіщення про нові пропозиції у обраній категорії категорії.`,
              ),
              new KeyboardMessage(MAIN_KEYBOARD),
            ]);
            if (order.verify === false) {
              this.viber_bot.sendMessage({ id: res.userProfile.id }, [
                new TextMessage(
                  `Ваш код верифікаціЇ: ${order.sms}\nПерейти на сайт: ${process.env.CODE_LINK}`,
                ),
                new KeyboardMessage(MAIN_KEYBOARD),
              ]);
            }
            return updatedUser || updatedOrder;
          } else if (
            (user && user.viber === res.userProfile.id) ||
            (order && order.viber === res.userProfile.id)
          ) {
            const updatedUser = await this.userModel.findByIdAndUpdate(
              { _id: user.id },
              {
                viber: null,
              },
            );
            const updatedOrder = await this.ordersModel.findByIdAndUpdate(
              { _id: order.id },
              {
                viber: null,
              },
            );
            await updatedUser.save();
            await updatedOrder.save();
            this.viber_bot.sendMessage({ id: res.userProfile.id }, [
              new TextMessage(
                `${res.userProfile.name} Ви відписалися від сповіщення про нові пропозиції.`,
              ),
              new KeyboardMessage(MAIN_KEYBOARD),
            ]);
            return updatedUser || updatedOrder;
          } else {
            this.viber_bot.sendMessage({ id: res.userProfile.id }, [
              new TextMessage(
                `Користувач з номером ${phoneNumber} не зареєстрований у нашій системі.`,
              ),
              new KeyboardMessage(MAIN_KEYBOARD),
            ]);
          }
        }
      } catch (error) {
        console.error('Error while sending message:', error);
      }
    });
    this.viber_bot
      .getBotProfile()
      .then((response: any) => console.log(`Bot Named: ${response.name}`))
      .catch((error: any) => {
        console.error('Error while getting bot profile:', error);
      });
    // VIBER BOT CODE END

    //TELEGRAM BOT CODE START
    const token = process.env.BOT_TELEGRAM;
    this.tg_bot = new TelegramBot(token, { polling: true });
    this.tg_bot.setMyCommands([
      { command: '/stop', description: 'Зупинити оповіщення' },
      { command: '/orders', description: 'Управління замовленнями' },
      { command: '/reviews', description: 'Управління відгуками' },
    ]);

    // KEYBOARDS

    const optURL = {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Перейти на сайт',
              url: 'https://www.wechirka.com/',
            },
          ],
        ],
        resize_keyboard: true,
      },
    };

    const optCont = {
      reply_markup: {
        keyboard: [
          [
            {
              text: 'Відправити номер телефону',
              request_contact: true,
            },
          ],
        ],
        resize_keyboard: true,
      },
    };

    // START BOT
    this.tg_bot.onText(/\/start/, async (msg) => {
      try {
        const chatId = msg.chat.id;
        this.tg_bot.sendMessage(
          chatId,
          `Привіт ${msg.from.first_name}. Я бот ресурсу WECHIRKA! Щоб отримувати сповіщеня, натисніть кнопку "Відправити номер телефону" для реєстрації у боті.\n\nСюди, Вам будуть надходити сповіщеня про замовлення або пропозиції від виконавців.`,
          optCont,
        );
      } catch (e) {
        throw new Error(`Помилка надсилання повідомлення: ${e}`);
      }
    });

    this.tg_bot.onText(/\/orders/, async (msg) => {
      try {
        const chatId = msg.chat.id;
        const user = await this.userModel.findOne({ tg_chat: chatId }).exec();
        const find = await this.ordersModel.find({ tg_chat: chatId }).exec();

        if (user.tg_chat && Array.isArray(find) && find.length === 0) {
          this.tg_bot.sendMessage(
            chatId,
            'Ви не зареєстровані як замовник',
            optCont,
          );
        }
        if (Array.isArray(find) && find.length === 0) {
          this.tg_bot.sendMessage(
            chatId,
            'Ми не знайшли Ваших заявок, напевно ви не зареєструвались, натисніть кнопку "Відправити номер телефону" для реєстрації у боті',
            optCont,
          );
        }
        if (find || user.tg_chat === find[0].tg_chat) {
          find.map((finded: Orders) => {
            const msg = `Замовник: ${finded.name}.
      Дата події: ${finded.date}.
      Категорія: ${finded.category[0].subcategories[0].name}.
      Вимоги: ${finded.description}.
      Локація: ${finded.location}.
      Гонорар: ${finded.price}.
      Кількість відгуків: ${finded.approve_count}.
      Статус: ${finded.active ? 'Активний' : 'Неактивний'}.\n`;
            if (finded.active === true) {
              const keyboard: InlineKeyboardMarkup = {
                inline_keyboard: [
                  [
                    {
                      text: 'Видалити',
                      callback_data: `delete:${finded._id}:${chatId}`,
                    },
                    {
                      text: 'Деактивувати',
                      callback_data: `deactive:${finded._id}:${chatId}`,
                    },
                  ],
                  [
                    {
                      text: 'Відгуки на пропозицію',
                      callback_data: `users:${finded._id}:${chatId}`,
                    },
                  ],
                ],
              };
              this.tg_bot.sendMessage(chatId, msg, {
                reply_markup: keyboard,
              });
            } else {
              const keyboard: InlineKeyboardMarkup = {
                inline_keyboard: [
                  [
                    {
                      text: 'Видалити',
                      callback_data: `delete:${finded._id}:${chatId}`,
                    },
                    {
                      text: 'Активувати',
                      callback_data: `active:${finded._id}:${chatId}`,
                    },
                  ],
                  [
                    {
                      text: 'Відгуки на пропозицію',
                      callback_data: `users:${finded._id}:${chatId}`,
                    },
                  ],
                ],
              };
              this.tg_bot.sendMessage(chatId, msg, {
                reply_markup: keyboard,
              });
            }
          });
        }
      } catch (e) {
        throw new Error(`Помилка надсилання повідомлення: ${e}`);
      }
    });

    this.tg_bot.onText(/\/reviews/, async (msg) => {
      try {
        const chatId = msg.chat.id;
        const user = await this.userModel.findOne({ tg_chat: chatId }).exec();
        const find = user.accepted_orders;

        if (!user && Array.isArray(find) && find.length === 0) {
          this.tg_bot.sendMessage(
            chatId,
            'Ви не зареєстровані як виконавець',
            optCont,
          );
        }
        if (Array.isArray(find) && find.length === 0) {
          this.tg_bot.sendMessage(
            chatId,
            'Ми не знайшли Ваших відгуків.',
            optCont,
          );
        }
        if (Array.isArray(find) && find.length !== 0) {
          find.map(async (finded: Orders) => {
            const findetOrder = await this.ordersModel.findOne({
              _id: finded,
            });
            const msg = `Замовник: ${findetOrder.name}.
      Дата події: ${findetOrder.date}.
      Категорія: ${findetOrder.category[0].subcategories[0].name}.
      Вимоги: ${findetOrder.description}.
      Локація: ${findetOrder.location}.
      Гонорар: ${findetOrder.price}.      
      Статус: ${findetOrder.active ? 'Активний' : 'Неактивний'}.\n`;

            this.tg_bot.sendMessage(chatId, msg, optCont);
          });
        }
      } catch (e) {
        throw new Error(`Помилка надсилання повідомлення: ${e}`);
      }
    });

    this.tg_bot.on('contact', async (msg) => {
      try {
        const chatId = msg.chat.id;
        const phoneNumber = msg.contact.phone_number;
        const user = await this.userModel
          .findOne({ phone: phoneNumber })
          .exec();
        const order = await this.ordersModel
          .findOne({ phone: phoneNumber })
          .exec();
        if (user && user.tg_chat === null) {
          await this.userModel.findByIdAndUpdate(user.id, {
            tg_chat: chatId,
            verify: true,
          });

          await this.tg_bot.sendMessage(
            chatId,
            `Дякую, ${msg.from.first_name} тепер Вам будуть надходити повідомлення про нові пропозиції в обраній категорії. Щоб вимкнути оповіщення виберіть "Меню" та натисніть /stop`,
            optURL,
          );
        }
        if (order && order.tg_chat === null) {
          await this.ordersModel.findByIdAndUpdate(order.id, {
            tg_chat: chatId,
          });
          await this.tg_bot.sendMessage(
            chatId,
            `Дякую, ${msg.from.first_name} тепер Вам будуть надходити повідомлення про нові пропозиції в обраній категорії. Щоб вимкнути оповіщення виберіть "Меню" та натисніть /stop`,
            optURL,
          );
          if (order.verify === false) {
            await this.tg_bot.sendMessage(
              chatId,
              `Ваш код верифікації: ${order.sms}\nПерейти на сайт: ${process.env.CODE_LINK}`,
            );
          }
        }
      } catch (e) {
        throw new Error(`Помилка надсилання повідомлення: ${e}`);
      }
    });

    this.tg_bot.on('callback_query', async (query) => {
      try {
        const { data } = query;
        const [action, phone, chatId] = data.split(':');

        switch (action) {
          case 'accept':
            const order = await this.sendTgAgreement(phone, chatId);
            if (order === true) {
              const msg = `${query.message.text}: Ви погодились на це замовлення \n`;
              this.tg_bot.editMessageText(msg, {
                chat_id: chatId,
                message_id: query.message.message_id,
              });
            }
            break;
          case 'disagree':
            const orders = await this.ordersModel.findOne(phone);
            const user = await this.userModel.findOne({ tg_chat: chatId });
            user.disagree_order += 1;
            await this.userModel.findByIdAndUpdate(user.id, {
              disagree_order: user.disagree_order,
            });
            this.tg_bot.sendMessage(
              chatId,
              `Ви відмовились від виконання замовлення: ${orders.description}.`,
              optURL,
            );
            break;
          case 'delete':
            const delOrder = await this.ordersModel.findById(phone);
            this.tg_bot.sendMessage(
              chatId,
              `Ви видалили замевлення: ${delOrder.description}.`,
              optURL,
            );
            await this.userModel.updateMany(
              { accepted_orders: phone },
              { $pull: { accepted_orders: phone } },
            );
            await this.ordersModel.findByIdAndRemove(phone);
            break;
          case 'active':
            const actiOrder = await this.ordersModel.findById(phone);
            await this.ordersModel.findByIdAndUpdate(actiOrder.id, {
              active: true,
            });
            this.tg_bot.sendMessage(
              chatId,
              `Ви активували замевлення: ${actiOrder.description}.`,
              optURL,
            );

            break;
          case 'deactive':
            const deactiOrder = await this.ordersModel.findById(phone);
            await this.ordersModel.findByIdAndUpdate(deactiOrder.id, {
              active: false,
            });
            this.tg_bot.sendMessage(
              chatId,
              `Ви деактивували замевлення: ${deactiOrder.description}.`,
              optURL,
            );
            break;
          case 'users':
            const findOrder = await this.ordersModel.findOne({ _id: phone });
            if (findOrder.accepted_users.length === 0) {
              this.tg_bot.sendMessage(
                chatId,
                `Немає відгуків на пропозицію.`,
                optURL,
              );
            } else {
              findOrder.accepted_users.map(async (user: any) => {
                const findedUser = await this.userModel.findOne({ _id: user });
                const msgOrder = `Замовлення:\n${findOrder.description}\nКористувач: ${findedUser.firstName}.\nКатегорія: ${findedUser.category[0].subcategories[0].name}\nОплата: ${findedUser.price}\nТелефон: +${findedUser.phone}.\nПосилання на профіль:\n${process.env.FRONT_LINK}artists/${findedUser._id}.`;
                this.tg_bot.sendMessage(chatId, msgOrder);
              });
            }
            break;
          default:
            break;
        }
      } catch (e) {
        console.log(e);
      }
    });

    this.tg_bot.onText(/\/stop/, async (msg) => {
      const chatId = msg.chat.id;
      const user = await this.userModel.findOne({ tg_chat: chatId }).exec();
      if (user) {
        await this.userModel.findByIdAndUpdate(user.id, { tg_chat: null });
      } else {
        const order = await this.ordersModel.find({ tg_chat: chatId }).exec();
        if (Array.isArray(order) && order.length > 0) {
          order.map(async (order) => {
            await this.ordersModel.findByIdAndUpdate(order.id, {
              tg_chat: null,
            });
          });
        }
      }
      this.tg_bot.sendMessage(
        chatId,
        `Ви вимкнули оповіщення. Щоб знову отримувати оповіщення, натисніть кнопку "Відправити номер телефону".`,
        optCont,
      );
    });
  }
  // VIMER METHODS ON CLASS ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  async sendNewViberOrder(userId: string, order: Orders) {
    try {
      const msg = `Доброго дня, з'явилось нове повідомлення по Вашому профілю. \n
      Замовник: ${order.name}.
      Дата події: ${order.date}.
      Категорія: ${order.category[0].subcategories[0].name}.
      Вимоги замовника: ${order.description}.
      Локація: ${order.location}.
      Гонорар: ${order.price}`;

      const KEYBOARD = {
        Type: 'keyboard',
        Revision: 1,
        ButtonsGroupColumns: 3,
        ButtonsGroupRows: 1,
        Buttons: [
          {
            ActionType: 'reply',
            ActionBody: `accept:${order.phone}:${userId}`,
            Text: '<font color="#FFFFFF" size="5">Згоден</font>',
            TextSize: 'regular',
            TextVAlign: 'middle',
            TextHAlign: 'center',
            BgColor: '#094356',
          },
          {
            ActionType: 'reply',
            ActionBody: `disagree:${order.phone}:${userId}`,
            Text: '<font color="#FFFFFF" size="5">Не згоден</font>',
            TextSize: 'regular',
            TextVAlign: 'middle',
            TextHAlign: 'center',
            BgColor: '#094356',
          },
        ],
      };

      this.viber_bot.sendMessage({ id: userId }, [
        new TextMessage(msg),
        new RichMediaMessage(KEYBOARD),
      ]);
    } catch (error) {
      throw new Error(`Помилка надсиланння повідомлення: ${error}`);
    }
  }

  async sendViberAgreement(orderPhone: string, userChatId: string) {
    try {
      const order = await this.ordersModel.findOne({
        phone: orderPhone,
      });
      const user = await this.userModel.findOne({ viber: userChatId });

      const { viber, active, description, tg_chat } = order;
      const { firstName, phone, _id } = user;

      const accept = user.accepted_orders;
      if (accept.includes(order._id)) {
        const msg = `Ви вже погодились на це замовлення`;
        this.viber_bot.sendMessage({ id: userChatId }, [
          new TextMessage(msg),
          new KeyboardMessage(MAIN_KEYBOARD),
        ]);
        return false;
      } else if (viber !== null && active === true) {
        const msgTrue = `Доброго дня, замовник отримав Вашу відповідь на замовлення:\n"${order.description}".\n \nВ категорії:\n"${order.category[0].name} - ${order.category[0].subcategories[0].name}". \n \nОчікуйте на дзвінок або повідомлення`;
        user.agree_order += 1;
        user.accepted_orders.push(order._id);
        await this.userModel.findByIdAndUpdate(user.id, {
          agree_order: user.agree_order,
          accepted_orders: user.accepted_orders,
        });
        order.approve_count += 1;
        order.accepted_users.push(user._id);
        await this.ordersModel.findByIdAndUpdate(order.id, {
          accepted_users: order.accepted_users,
          approve_count: order.approve_count,
        });
        this.viber_bot.sendMessage({ id: userChatId }, [
          new TextMessage(msgTrue),
          new KeyboardMessage(MAIN_KEYBOARD),
        ]);
        const msgOrder =
          `Користувач ${firstName} готовий виконати ваше замовлення "${description}". \n Посилання на профіль виконавця: ${process.env.FRONT_LINK}artists/${_id}.\n Ви можете написати йому у Viber, або зателефонувати по номеру. \n` +
          `\n Телефон: +${phone}`;

        await this.viber_bot.sendMessage({ id: viber }, [
          new PictureMessage(user.master_photo.url),
          new TextMessage(msgOrder),
          new KeyboardMessage(MAIN_KEYBOARD),
        ]);
        return true;
      } else if (tg_chat !== null && order.active === true) {
        const msgOrder = `Користувач ${user.firstName} готовий виконати ваше замовлення "${order.description}".
      Ви можете написати йому в Viber, або зателефонувати по номеру +${user.phone}. \n
      Посилання на профіль виконавця ${process.env.FRONT_LINK}artists/${user._id}.`;
        await this.sendMessageTg(order.tg_chat.toString(), msgOrder);
        if (user.photo.length > 0) {
          const images = user.photo.map((photos: any) => ({
            type: 'photo',
            media: photos.url,
          }));
          await this.tg_bot.sendMediaGroup(order.tg_chat.toString(), images);
        }
        if (user.video.length > 0) {
          const videos = user.video.map((video: any) => ({
            type: 'video',
            media: video.url,
          }));
          await this.tg_bot.sendMediaGroup(order.tg_chat.toString(), videos);
        }

        const msgTrue = `Доброго дня, замовник отримав Вашу відповідь на замовлення:\n"${order.description}".\n \nВ категорії:\n"${order.category[0].name} - ${order.category[0].subcategories[0].name}". \n \nОчікуйте на дзвінок або повідомлення`;
        this.viber_bot.sendMessage({ id: userChatId }, [
          new TextMessage(msgTrue),
          new KeyboardMessage(MAIN_KEYBOARD),
        ]);
      } else if (viber === null && tg_chat === null) {
        const msg = `Замовник ще не активував чат-бот, спробуйте пізніше`;
        this.viber_bot.sendMessage(userChatId, msg);
        return false;
      } else {
        const msg = `Замовник призупинив пошук`;
        this.viber_bot.sendMessage(userChatId, msg);
        return true;
      }
    } catch (e) {
      throw new Error(`Помилка надсилання повідомлення: ${e}`);
    }
  }

  async myOrdersList(chatId: string) {
    try {
      const user = await this.userModel.findOne({ viber: chatId }).exec();
      const find = await this.ordersModel.find({ viber: chatId }).exec();
      if (
        (user.viber !== null && Array.isArray(find) && find.length === 0) ||
        find[0].viber !== user.viber
      ) {
        this.viber_bot.sendMessage(
          { id: chatId },
          new TextMessage(
            'Ви не являетесь замовником або не зареєструвались у чат-боті. Якщо Ви замовник будь ласка, відправте свій номер телефону у форматі 380981231122',
          ),
        );
      } else if (!user || (Array.isArray(find) && find.length === 0)) {
        this.viber_bot.sendMessage(
          { id: chatId },
          new TextMessage(
            'Ми не знайшли Ваших заявок, напевно ви не зарееструвались у чат боті. Будь ласка, відправте свій номер телефону у форматі 380981231122',
          ),
        );
      } else {
        find.map((finded: Orders) => {
          const FIND_KEYBOARD = {
            Type: 'keyboard',
            Revision: 1,
            ButtonsGroupColumns: 3,
            ButtonsGroupRows: 1,
            Buttons: [
              {
                ActionType: 'open-url',
                ActionBody: 'https://www.wechirka.com',
                Text: '<font color="#FFFFFF" size="5">Перейти на наш сайт</font>',
                TextSize: 'regular',
                TextVAlign: 'middle',
                TextHAlign: 'center',
                BgColor: '#094356',
              },
              {
                ActionType: 'reply',
                ActionBody: `orders:${finded.name}:${finded.viber}`,
                Text: '<font color="#FFFFFF" size="5">Мої заявки (лише для замовників)</font>',
                TextSize: 'regular',
                TextVAlign: 'middle',
                TextHAlign: 'center',
                BgColor: '#094356',
              },
              {
                ActionType: 'reply',
                ActionBody: `review:${finded.name}:${chatId}`,
                Text: '<font color="#FFFFFF" size="5">Мої відгуки (лише для виконавців)</font>',
                TextSize: 'regular',
                TextVAlign: 'middle',
                TextHAlign: 'center',
                BgColor: '#094356',
              },
            ],
          };
          const msg = `Замовник: ${finded.name}.
      Дата події: ${finded.date}.
      Категорія: ${finded.category[0].subcategories[0].name}.
      Вимоги замовника: ${finded.description}.
      Локація: ${finded.location}.
      Гонорар: ${finded.price}.
      Кількість відгуків: ${finded.approve_count}.
      Статус: ${finded.active ? 'Активний' : 'Неактивний'}.\n`;
          if (finded.active === true) {
            const KEYBOARD = {
              Type: 'keyboard',
              Revision: 1,
              ButtonsGroupColumns: 3,
              ButtonsGroupRows: 1,
              Buttons: [
                {
                  ActionType: 'reply',
                  ActionBody: `delete:${finded._id}:${finded.viber}`,
                  Text: '<font color="#FFFFFF" size="5">Видалити</font>',
                  TextSize: 'regular',
                  TextVAlign: 'middle',
                  TextHAlign: 'center',
                  BgColor: '#094356',
                },
                {
                  ActionType: 'reply',
                  ActionBody: `deactive:${finded._id}:${finded.viber}`,
                  Text: '<font color="#FFFFFF" size="5">Деактивувати</font>',
                  TextSize: 'regular',
                  TextVAlign: 'middle',
                  TextHAlign: 'center',
                  BgColor: '#094356',
                },
              ],
            };
            const USERS = {
              Type: 'keyboard',
              Revision: 1,
              ButtonsGroupColumns: 6,
              ButtonsGroupRows: 1,
              Buttons: [
                {
                  ActionType: 'reply',
                  ActionBody: `users:${finded._id}:${finded.viber}`,
                  Text: '<font color="#FFFFFF" size="5">Відгуки на пропозицію</font>',
                  TextSize: 'regular',
                  TextVAlign: 'middle',
                  TextHAlign: 'center',
                  BgColor: '#094356',
                },
              ],
            };
            this.viber_bot.sendMessage({ id: chatId }, [
              new TextMessage(msg),
              new RichMediaMessage(KEYBOARD, USERS),
              new RichMediaMessage(USERS),
              new KeyboardMessage(FIND_KEYBOARD),
            ]);
          } else {
            const KEYBOARD = {
              Type: 'keyboard',
              Revision: 1,
              ButtonsGroupColumns: 3,
              ButtonsGroupRows: 1,
              Buttons: [
                {
                  ActionType: 'reply',
                  ActionBody: `delete:${finded._id}:${finded.viber}`,
                  Text: '<font color="#FFFFFF" size="5">Видалити</font>',
                  TextSize: 'regular',
                  TextVAlign: 'middle',
                  TextHAlign: 'center',
                  BgColor: '#094356',
                },
                {
                  ActionType: 'reply',
                  ActionBody: `active:${finded._id}:${finded.viber}`,
                  Text: '<font color="#FFFFFF" size="5">Активувати</font>',
                  TextSize: 'regular',
                  TextVAlign: 'middle',
                  TextHAlign: 'center',
                  BgColor: '#094356',
                },
              ],
            };
            const USERS = {
              Type: 'keyboard',
              Revision: 1,
              ButtonsGroupColumns: 6,
              ButtonsGroupRows: 1,
              Buttons: [
                {
                  ActionType: 'reply',
                  ActionBody: `users:${finded._id}:${finded.viber}`,
                  Text: '<font color="#FFFFFF" size="5">Відгуки на пропозицію</font>',
                  TextSize: 'regular',
                  TextVAlign: 'middle',
                  TextHAlign: 'center',
                  BgColor: '#094356',
                },
              ],
            };
            this.viber_bot.sendMessage({ id: chatId }, [
              new TextMessage(msg),
              new RichMediaMessage(KEYBOARD),
              new RichMediaMessage(USERS),
              new KeyboardMessage(FIND_KEYBOARD),
            ]);
          }
        });
      }
    } catch (e) {
      throw new Error(`Помилка надсилання повідомлення: ${e}`);
    }
  }

  async myReviewList(chatId: string) {
    try {
      const user = await this.userModel.findOne({ viber: chatId }).exec();
      const orederArr = user.accepted_orders;
      if (
        user.viber !== null &&
        Array.isArray(orederArr) &&
        orederArr.length === 0
      ) {
        this.viber_bot.sendMessage(
          { id: chatId },
          new TextMessage('Ми не знайшли Ваших відгуків на замовлення'),
        );
      } else if (!user) {
        this.viber_bot.sendMessage(
          { id: chatId },
          new TextMessage(
            'Ми не знайшли Ваших відгуків, напевно ви не зарееструвались у чат боті. Будь ласка, відправте свій номер телефону у форматі 380981231122',
          ),
        );
      } else {
        orederArr.map(async (finded: Orders) => {
          const myOrders = await this.ordersModel.findOne({ _id: finded });
          const FIND_KEYBOARD = {
            Type: 'keyboard',
            Revision: 1,
            ButtonsGroupColumns: 3,
            ButtonsGroupRows: 1,
            Buttons: [
              {
                ActionType: 'open-url',
                ActionBody: 'https://www.wechirka.com',
                Text: '<font color="#FFFFFF" size="5">Перейти на наш сайт</font>',
                TextSize: 'regular',
                TextVAlign: 'middle',
                TextHAlign: 'center',
                BgColor: '#094356',
              },
              {
                ActionType: 'reply',
                ActionBody: `orders:${user.name}:${user.viber}`,
                Text: '<font color="#FFFFFF" size="5">Мої заявки (лише для замовників)</font>',
                TextSize: 'regular',
                TextVAlign: 'middle',
                TextHAlign: 'center',
                BgColor: '#094356',
              },
              {
                ActionType: 'reply',
                ActionBody: `review:${user.viber}:${user.viber}`,
                Text: '<font color="#FFFFFF" size="5">Мої відгуки (лише для виконавців)</font>',
                TextSize: 'regular',
                TextVAlign: 'middle',
                TextHAlign: 'center',
                BgColor: '#094356',
              },
            ],
          };
          const msg = `Замовник: ${myOrders.name}.
      Дата події: ${myOrders.date}.
      Категорія: ${myOrders.category[0].subcategories[0].name}.
      Вимоги замовника: ${myOrders.description}.
      Локація: ${myOrders.location}.
      Гонорар: ${myOrders.price}.      
      Статус: ${myOrders.active ? 'Активний' : 'Неактивний'}.\n`;

          this.viber_bot.sendMessage({ id: chatId }, [
            new TextMessage(msg),
            new KeyboardMessage(FIND_KEYBOARD),
          ]);
        });
      }
    } catch (e) {
      throw new Error(`Помилка надсилання повідомлення: ${e}`);
    }
  }

  async sendMessagesToAllViberUsers(msg: string) {
    const allOrders = await this.ordersModel.find({}).select('viber').exec();
    const allUsers = await this.userModel.find({}).select('viber').exec();

    const allViberUsers = allOrders.concat(allUsers);
    allViberUsers.map((user: any) => {
      if (user.viber !== null) {
        this.viber_bot.sendMessage({ id: user.viber }, [
          new TextMessage(msg),
          new KeyboardMessage(MAIN_KEYBOARD),
        ]);
      }
    });
  }

  async sendMessageViber(chatId: string, msg: string) {
    try {
      const message = await this.viber_bot.sendMessage({ id: chatId }, [
        new TextMessage(msg),
        new KeyboardMessage(MAIN_KEYBOARD),
      ]);
      return message;
    } catch (error) {
      throw new Error(`Помилка надсилання повідомлення: ${error}`);
    }
  }

  async startServer() {
    const http = require('http');
    const port = 8080;
    ngrok
      .connect({
        addr: port,
        authtoken_from_env: true,
      })
      .then(async (listener) => {
        console.log('publicUrl => ', listener.url());
        await http
          .createServer(this.viber_bot.middleware())
          .listen(port, () => this.viber_bot.setWebhook(listener.url()));
      })
      .catch((error) => {
        console.log('Can not connect to ngrok server. Is it running?');
        console.error(error);
      });
  }

  //TELEGRAMM METHODS ON CLASS /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  async sendMessageTg(chatId: string, msg: string) {
    try {
      const message = await this.tg_bot.sendMessage(chatId, msg);
      return message;
    } catch (error) {
      throw new Error(`Помилка надсилання повідомлення: ${error}`);
    }
  }

  async sendMessagesToAllTgUsers(msg: string) {
    const allOrders = await this.ordersModel.find({}).select('tg_chat').exec();
    const allUsers = await this.userModel.find({}).select('tg_chat').exec();
    const allTgUsers = allOrders.concat(allUsers);
    allTgUsers.map((user: any) => {
      if (user.tg_chat !== null) {
        this.sendMessageTg(user.tg_chat.toString(), msg);
      }
    });
  }

  async sendCode(chatId: string) {
    try {
      const telegram = await this.ordersModel.findOne({ tg_chat: chatId });
      const viber = await this.ordersModel.findOne({ viber: chatId });
      if (telegram) {
        const msg = `Ваш код верифікації: ${telegram.sms}\nПерейти на сайт: ${process.env.CODE_LINK}`;
        await this.sendMessageTg(chatId, msg);
      } else if (viber) {
        const msg = `Ваш код верифікації: ${viber.sms}\nПерейти на сайт: ${process.env.CODE_LINK}`;
        await this.viber_bot.sendMessage(
          { id: chatId },
          new TextMessage(msg),
          new KeyboardMessage(MAIN_KEYBOARD),
        );
      } else {
        throw new Error(`Помилка надсилання повідомлення`);
      }
    } catch (error) {
      throw new Error(`Помилка надсилання повідомлення: ${error}`);
    }
  }

  async sendTgAgreement(phone: string, chatId: string) {
    try {
      const order = await this.ordersModel.findOne({ phone: phone });
      const user = await this.userModel.findOne({ tg_chat: chatId });
      const accept = user.accepted_orders;
      if (accept.includes(order.id)) {
        const msg = `Ви вже погодились на це замовлення`;
        await this.sendMessageTg(chatId, msg);
        return false;
      } else if (order.tg_chat !== null && order.active === true) {
        const msgTrue = `Доброго дня, замовник отримав Вашу відповідь на замовлення:\n"${order.description}".\n \nВ категорії:\n"${order.category[0].name} - ${order.category[0].subcategories[0].name}". \n \nОчікуйте на дзвінок або повідомлення`;
        await this.sendMessageTg(chatId, msgTrue);
        order.approve_count += 1;
        user.agree_order += 1;
        user.accepted_orders.push(order.id);
        await this.userModel.findByIdAndUpdate(user.id, {
          agree_order: user.agree_order,
          accepted_orders: user.accepted_orders,
        });
        order.accepted_users.push(user.id);
        await this.ordersModel.findByIdAndUpdate(order.id, {
          approve_count: order.approve_count,
          accepted_users: order.accepted_users,
        });
        const msgOrder = `Виконавець ${user.firstName} готовий виконати ваше замовлення "${order.description}".
      Ви можете написати йому в телеграм @${user.telegram}, або зателефонувати по номеру ${user.phone}. \n
      Посилання на профіль виконавця ${process.env.FRONT_LINK}artists/${user._id}.`;
        await this.sendMessageTg(order.tg_chat.toString(), msgOrder);
        if (user.photo.length > 0) {
          const images = user.photo.map((photos: any) => ({
            type: 'photo',
            media: photos.url,
          }));
          await this.tg_bot.sendMediaGroup(order.tg_chat.toString(), images);
        }
        if (user.video.length > 0) {
          const videos = user.video.map((video: any) => ({
            type: 'video',
            media: video.url,
          }));
          await this.tg_bot.sendMediaGroup(order.tg_chat.toString(), videos);
        }
        return true;
      } else if (order.viber !== null && order.active === true) {
        const msgOrder =
          `Користувач ${user.firstName} готовий виконати ваше замовлення "${order.description}". \n Посилання на профіль виконавця: ${process.env.FRONT_LINK}artists/${user._id}.\n Ви можете написати йому у Viber, або зателефонувати по номеру. \n` +
          `\n Телефон: +${phone}`;

        await this.viber_bot.sendMessage({ id: order.viber }, [
          new PictureMessage(user.master_photo.url),
          new TextMessage(msgOrder),
          new KeyboardMessage(MAIN_KEYBOARD),
        ]);
        const msgTrue = `Доброго дня, замовник отримав Вашу відповідь на замовлення:\n"${order.description}".\n \nВ категорії:\n"${order.category[0].name} - ${order.category[0].subcategories[0].name}". \n \nОчікуйте на дзвінок або повідомлення`;
        await this.sendMessageTg(chatId, msgTrue);
        order.approve_count = +1;
        await this.ordersModel.findByIdAndUpdate(order.id, {
          approve_count: order.approve_count,
        });
        return true;
      } else if (order.tg_chat === null && order.viber === null) {
        const msg = `Замовник ще не активував чат-бот, спробуйте пізніше`;
        await this.sendMessageTg(chatId, msg);
        return false;
      } else if (order.active === false) {
        const msg = `Замовник призупинив пошук`;
        await this.sendMessageTg(chatId, msg);
        return false;
      }
    } catch (e) {
      throw new Error(`Помилка надсилання повідомлення: ${e}`);
    }
  }

  async sendNewTgOrder(chatId: string, order: Orders) {
    try {
      const msg = `Доброго дня, з'явилось нове повідомлення за Вашим профілем. 
      Замовник: ${order.name}.
      Дата події: ${order.date}.
      Категорія: ${order.category[0].subcategories[0].name}.
      Вимоги замовника: ${order.description}.
      Локація: ${order.location}.
      Гонорар: ${order.price}`;
      const keyboard: InlineKeyboardMarkup = {
        inline_keyboard: [
          [
            {
              text: 'Згоден',
              callback_data: `accept:${order.phone}:${chatId}`,
            },
            {
              text: 'Не цікаво',
              callback_data: `disagree:${order.id}:${chatId}`,
            },
          ],
          [
            {
              text: 'Перейти на сайт',
              url: 'https://www.wechirka.com/',
            },
          ],
        ],
      };
      const result = await this.tg_bot.sendMessage(chatId, msg, {
        reply_markup: keyboard,
      });
      return result;
    } catch (error) {
      throw new Error(`Помилка надсиланння повідомлення: ${error}`);
    }
  }

  async findMyOrders(chatId: string) {}
}
