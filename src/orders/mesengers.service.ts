import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as TelegramBot from 'node-telegram-bot-api';
import { InlineKeyboardMarkup } from 'node-telegram-bot-api';
export const ViberBot = require('viber-bot').Bot;
const Keyboard = require('viber-bot').Keyboard;
const BotEvents = require('viber-bot').Events;
const TextMessage = require('viber-bot').Message.Text;
const UrlMessage = require('viber-bot').Message.Url;
const ContactMessage = require('viber-bot').Message.Contact;
const PictureMessage = require('viber-bot').Message.Picture;
const VideoMessage = require('viber-bot').Message.Video;
const LocationMessage = require('viber-bot').Message.Location;
const StickerMessage = require('viber-bot').Message.Sticker;
const FileMessage = require('viber-bot').Message.File;
const RichMediaMessage = require('viber-bot').Message.RichMedia;
const KeyboardMessage = require('viber-bot').Message.Keyboard;
import * as express from 'express';
import { User } from 'src/users/users.model';
import { Orders } from 'src/orders/order.model';
const ngrok = require('ngrok');

const MAIN_KEYBOARD = {
  Type: 'keyboard',
  Revision: 1,
  ButtonsGroupColumns: 3,
  ButtonsGroupRows: 1,
  Buttons: [
    {
      ActionType: 'open-url',
      ActionBody: 'https://www.wechirka.com',
      Text: 'Перейти на наш сайт',
      TextSize: 'regular',
      TextVAlign: 'middle',
      TextHAlign: 'center',
      BgColor: '#4CAF50',
    },
    {
      ActionType: 'reply',
      ActionBody: `orders`,
      Text: 'Мої заявки (лише для замовників)',
      TextSize: 'regular',
      TextVAlign: 'middle',
      TextHAlign: 'center',
      BgColor: '#4CAF50',
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
        'https://raw.githubusercontent.com/devrelv/drop/master/151-icon.png',
    });
    // MSG ON BOT STARTED
    this.viber_bot.onSubscribe(async (response: any) => {
      say(
        response,
        `Привіт ${response.userProfile.name}. Я бот ресурсу ${this.viber_bot.name}! Щоб отримувати сповіщеня, відправте свій номер телефону у форматі 380981231122. Сюди, Вам будуть надходити сповіщеня про найм`,
      );
    });

    function say(response: any, message: any) {
      response.send(new TextMessage(message));
    }
    //MAIN FUNCTION
    this.viber_bot.onTextMessage(/./, async (msg: any, res: any) => {
      try {
        const MAIN_KEYBOARD = {
          Type: 'keyboard',
          Revision: 1,
          ButtonsGroupColumns: 3,
          ButtonsGroupRows: 1,
          Buttons: [
            {
              ActionType: 'open-url',
              ActionBody: 'https://www.wechirka.com',
              Text: 'Перейти на наш сайт',
              TextSize: 'regular',
              TextVAlign: 'middle',
              TextHAlign: 'center',
              BgColor: '#4CAF50',
            },
            {
              ActionType: 'reply',
              ActionBody: `orders`,
              Text: 'Мої заявки (лише для замовників)',
              TextSize: 'regular',
              TextVAlign: 'middle',
              TextHAlign: 'center',
              BgColor: '#4CAF50',
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
            this.sendViberAgreement(phone, chatId);
            break;

          case 'disagree':
            say(res, 'Ви не погодились на пропозицію.');
            break;
        }

        if (!isNaN(phoneNumber) && phoneNumber.toString().length === 12) {
          const user = await this.userModel.findOne({ phone: phoneNumber });
          if (user) {
            const { viber } = user;
            if (viber === null) {
              user.viber = res.userProfile.id;
              user.save();
              say(
                res,
                `Дякую, ${res.userProfile.name} теперь Вам будуть надходити сповіщення про нові пропозиції твоїй категорії.`,
              );
            } else {
              user.viber = null;
              user.save();
              say(
                res,
                `${res.userProfile.name} Ви відписалися від сповіщення про нові пропозиції твоїй категорії.`,
              );
            }
          }

          if (!user) {
            const order = await this.ordersModel.findOne({
              phone: phoneNumber,
            });
            if (!order) {
              say(
                res,
                `${res.userProfile.name}, Ми не знайшли Ваш номер в базі`,
              );
            } else {
              const { viber } = order;
              if (viber === null) {
                order.viber = res.userProfile.id;
                order.save();
                say(
                  res,
                  `Дякую, ${res.userProfile.name} теперь Вам будуть надходити сповіщення про нові пропозиції твоїй категорії.`,
                );
              } else if (viber === res.userProfile.id) {
                order.viber = null;
                order.save();
                say(
                  res,
                  `${res.userProfile.name}, Ви відписалися від сповіщення про нові пропозиції у обраній категорії.`,
                );
              }
            }
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
      const chatId = msg.chat.id;

      this.tg_bot.sendMessage(
        chatId,
        'Будь ласка, натисніть кнопку "Відправити номер телефону" для надання номеру телефону.',
        optCont,
      );
    });

    this.tg_bot.onText(/\/orders/, async (msg) => {
      const chatId = msg.chat.id;
      const user = await this.userModel.findOne({ tg_chat: chatId }).exec();
      if (user) {
        this.tg_bot.sendMessage(chatId, 'Ви не являетесь замовником', optCont);
      }
      const find = await this.ordersModel.find({ tg_chat: chatId }).exec();
      if (Array.isArray(find) && find.length === 0) {
        this.tg_bot.sendMessage(
          chatId,
          'Ми не знайшли Ваших заявок, напевно ви не зарееструвались у чат боті (натисніть /start)',
          optCont,
        );
      } else {
        find.map((finded: Orders) => {
          const msg = `Замовник: ${finded.name}.
      Дата події: ${finded.date}.
      Категорія: ${finded.category[0].subcategories[0].name}.
      Вимоги замовника: ${finded.description}.
      Локація: ${finded.location}.
      Гонорар: ${finded.price}₴.
      Кількість відгуків: ${finded.approve_count}.`;
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
              ],
            };
            this.tg_bot.sendMessage(chatId, msg, {
              reply_markup: keyboard,
            });
          }
        });
      }
    });

    this.tg_bot.on('contact', async (msg) => {
      const chatId = msg.chat.id;
      const phoneNumber = msg.contact.phone_number;
      const user = await this.userModel.findOne({ phone: phoneNumber }).exec();
      if (user) {
        await this.userModel.findByIdAndUpdate(user.id, { tg_chat: chatId });

        this.tg_bot.sendMessage(
          chatId,
          `Дякую, ${msg.from.first_name} тепер Вам будуть надходити повідомлення про нові пропозиції в твоїй категорії. Щоб вимкнути оповіщення виберіть "Меню" та натисніть /stop`,
          optURL,
        );
      } else {
        const order = await this.ordersModel
          .findOne({ phone: phoneNumber })
          .exec();
        if (order) {
          await this.ordersModel.findByIdAndUpdate(order.id, {
            tg_chat: chatId,
          });
        }
        this.tg_bot.sendMessage(
          chatId,
          `Дякую, ${msg.from.first_name} тепер Вам будуть надходити повідомлення про нові пропозиції в твоїй категорії. Щоб вимкнути оповіщення виберіть "Меню" та натисніть /stop`,
          optURL,
        );
      }
    });

    this.tg_bot.on('callback_query', async (query) => {
      const { data } = query;
      const [action, phone, chatId] = data.split(':');

      switch (action) {
        case 'accept':
          const order = await this.sendTgAgreement(phone, chatId);
          if (order === true) {
            const msg = `${query.message.text} Ви погодились на це замовлення \n`;
            this.tg_bot.editMessageText(msg, {
              chat_id: chatId,
              message_id: query.message.message_id,
            });
          }
          break;
        case 'delete':
          const delOrder = await this.ordersModel.findById(phone);
          this.tg_bot.sendMessage(
            chatId,
            `Ви видалили замевлення: ${delOrder.description}.`,
            optURL,
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
        default:
          break;
      }
    });

    this.tg_bot.onText(/\/stop/, async (msg) => {
      const chatId = msg.chat.id;
      const user = await this.userModel.findOne({ tg_chat: chatId }).exec();
      if (user) {
        await this.userModel.findByIdAndUpdate(user.id, { tg_chat: null });
      } else {
        const order = await this.ordersModel
          .findOne({ tg_chat: chatId })
          .exec();
        if (order) {
          await this.ordersModel.findByIdAndUpdate(order.id, { tg_chat: null });
        }
      }
      this.tg_bot.sendMessage(
        chatId,
        `Ви вимкнули оповіщення. Щоб знову отримувати оповіщення, натисніть кнопку "Відправити номер телефону".`,
        optCont,
      );
    });
  }
  // VIMER METHODS ON CLASS
  async sendNewViberOrder(userId: string, order: Orders) {
    try {
      const msg = `Доброго дня, з'явилось нове повідомлення по Вашому профілю. \n
      Замовник: ${order.name}.
      Дата події: ${order.date}.
      Категорія: ${order.category[0].subcategories[0].name}.
      Вимоги замовника: ${order.description}.
      Локація: ${order.location}.
      Гонорар: ${order.price}₴`;

      const KEYBOARD = {
        Type: 'keyboard',
        Revision: 1,
        ButtonsGroupColumns: 3,
        ButtonsGroupRows: 1,
        Buttons: [
          {
            ActionType: 'reply',
            ActionBody: `accept:${order.phone}:${userId}`,
            Text: 'Згоден',
            TextSize: 'regular',
            TextVAlign: 'middle',
            TextHAlign: 'center',
            BgColor: '#4CAF50',
          },
          {
            ActionType: 'reply',
            ActionBody: 'disagree',
            Text: 'Не згоден',
            TextSize: 'regular',
            TextVAlign: 'middle',
            TextHAlign: 'center',
            BgColor: '#4CAF50',
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
      const order = await this.ordersModel.findOne({ phone: orderPhone });
      const user = await this.userModel.findOne({ viber: userChatId });

      const { viber, active, description, tg_chat } = order;
      const { firstName, phone, _id } = user;
      if (viber !== null && active === true) {
        const msgTrue = `Доброго дня, замовник отримав Вашу відповідь на замовлення:\n"${order.description}".\n \nВ категорії:\n"${order.category[0].name} - ${order.category[0].subcategories[0].name}". \n \nОчікуйте на дзвінок або повідомлення`;
        this.viber_bot.sendMessage({ id: userChatId }, [
          new TextMessage(msgTrue),
          new KeyboardMessage(MAIN_KEYBOARD),
        ]);
        const msgOrder =
          `Користувач ${firstName} готовий виконати ваше замовлення "${description}". \n Посилання на профіль виконавця: ${process.env.FRONT_LINK}${_id}.\n Ви можете написати йому у вайбер, або зателефонувати по номеру. \n` +
          `\n Телефон: +${phone}`;

        await this.viber_bot.sendMessage({ id: viber }, [
          new TextMessage(msgOrder),
          new KeyboardMessage(MAIN_KEYBOARD),
        ]);
        return true;
      } else if (tg_chat !== null && order.active === true) {
        const msgOrder = `Виконавець ${user.firstName} готовий виконати ваше замовлення "${order.description}".
      Ви можете написати йому в Viber, або зателефонувати по номеру ${user.phone}. \n
      Посилання на профіль виконавця ${process.env.FRONT_LINK}${user._id}. ${user.video[0]}`;
        await this.sendMessage(order.tg_chat.toString(), msgOrder);
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

  startServer() {
    if (process.env.NOW_URL || process.env.HEROKU_URL) {
      const http = require('http');
      const port = 1869;

      http.createServer(this.viber_bot.middleware()).listen(port, () => {
        console.log('Server is running!');
        this.viber_bot.setWebhook(
          process.env.NOW_URL || process.env.HEROKU_URL,
        );
      });
    } else {
      return ngrok
        .connect({
          addr: 1869,
        })
        .then(async (publicUrl: string) => {
          const http = require('http');
          const port = 1869;

          console.log('publicUrl => ', publicUrl);

          http.createServer(this.viber_bot.middleware()).listen(port, () => {
            console.log('Server is running!');
            this.viber_bot.setWebhook(publicUrl);
          });
        })
        .catch((error: string) => {
          console.log('Error occurred while connecting to ngrok.');
          console.error(error);
          process.exit(1);
        });
    }
  }

  //TELEGRAMM METHODS ON CLASS

  async sendMessage(chatId: string, msg: string) {
    try {
      const message = await this.tg_bot.sendMessage(chatId, msg);
      return message;
    } catch (error) {
      throw new Error(`Помилка надсилання повідомлення: ${error}`);
    }
  }

  async sendTgAgreement(phone: string, chatId: string) {
    try {
      const order = await this.ordersModel.findOne({ phone: phone });
      const user = await this.userModel.findOne({ tg_chat: chatId });
      if (order.tg_chat !== null && order.active === true) {
        const msgTrue = `Доброго дня, замовник отримав Вашу відповідь на замовлення:\n"${order.description}".\n \nВ категорії:\n"${order.category[0].name} - ${order.category[0].subcategories[0].name}". \n \nОчікуйте на дзвінок або повідомлення`;
        await this.sendMessage(chatId, msgTrue);
        order.approve_count = +1;
        await this.ordersModel.findByIdAndUpdate(order.id, {
          approve_count: order.approve_count,
        });
        const msgOrder = `Виконавець ${user.firstName} готовий виконати ваше замовлення "${order.description}".
      Ви можете написати йому в телеграм @${user.telegram}, або зателефонувати по номеру ${user.phone}. \n
      Посилання на профіль виконавця ${process.env.FRONT_LINK}artists/${user._id}. ${user.video[0]}`;
        await this.sendMessage(order.tg_chat.toString(), msgOrder);

        return true;
      } else if (order.viber !== null && order.active === true) {
        const msgOrder =
          `Користувач ${user.firstName} готовий виконати ваше замовлення "${order.description}". \n Посилання на профіль виконавця: ${process.env.FRONT_LINK}artists/${user._id}.\n Ви можете написати йому у вайбер, або зателефонувати по номеру. \n` +
          `\n Телефон: +${phone}`;

        await this.viber_bot.sendMessage({ id: order.viber }, [
          new TextMessage(msgOrder),
          new KeyboardMessage(MAIN_KEYBOARD),
        ]);
        const msgTrue = `Доброго дня, замовник отримав Вашу відповідь на замовлення:\n"${order.description}".\n \nВ категорії:\n"${order.category[0].name} - ${order.category[0].subcategories[0].name}". \n \nОчікуйте на дзвінок або повідомлення`;
        await this.sendMessage(chatId, msgTrue);
        order.approve_count = +1;
        await this.ordersModel.findByIdAndUpdate(order.id, {
          approve_count: order.approve_count,
        });
        return true;
      } else if (order.tg_chat === null && order.viber === null) {
        const msg = `Замовник ще не активував чат-бот, спробуйте пізніше`;
        await this.sendMessage(chatId, msg);
        return false;
      } else if (order.active === false) {
        const msg = `Замовник призупинив пошук`;
        await this.sendMessage(chatId, msg);
        return true;
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
      Гонорар: ${order.price}₴`;
      const keyboard: InlineKeyboardMarkup = {
        inline_keyboard: [
          [
            {
              text: 'Згоден',
              callback_data: `accept:${order.phone}:${chatId}`,
            },
            {
              text: 'Не цікаво',
              callback_data: `disagree:${chatId}`,
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
}
