import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
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
import { TelegramService } from 'src/telegram/telegram.service';
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
  ],
};

@Injectable()
export class ViberService {
  private app: express.Express;
  private bot: typeof ViberBot;
  constructor(
    @Inject(forwardRef(() => TelegramService))
    private readonly telegramService: TelegramService,
    @InjectModel(User.name)
    private userModel: User,
    @InjectModel(Orders.name)
    private orderModel: Orders,
  ) {
    this.bot = new ViberBot({
      authToken: process.env.VIBER_ACCESS_TOKEN,
      name: 'Wechirka',
      avatar:
        'https://raw.githubusercontent.com/devrelv/drop/master/151-icon.png',
    });

    this.bot.onSubscribe(async (response: any) => {
      say(
        response,
        `Привіт ${response.userProfile.name}. Я бот ресурсу ${this.bot.name}! Щоб отримувати сповіщеня, відправте свій номер телефону у форматі 380981231122. Сюди, Вам будуть надходити сповіщеня про найм`,
      );
    });

    function say(response: any, message: any) {
      response.send(new TextMessage(message));
    }

    this.bot.onTextMessage(/./, async (msg: any, res: any) => {
      try {
        this.bot.sendMessage(
          { id: res.userProfile.id },
          new KeyboardMessage(MAIN_KEYBOARD),
        );
        const messageText = msg.text;
        const phoneNumber = parseInt(messageText);
        const actionBody = msg.text;
        const [action, phone, chatId] = actionBody.split(':');
        switch (action) {
          case 'accept':
            this.sendAgreement(phone, chatId);
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
            const order = await this.orderModel.findOne({ phone: phoneNumber });
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
                  `Дякую, ${res.userProfile.name} теперь тобі будуть надходити сповіщення про нові пропозиції твоїй категорії.`,
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
    this.bot
      .getBotProfile()
      .then((response: any) => console.log(`Bot Named: ${response.name}`))
      .catch((error: any) => {
        console.error('Error while getting bot profile:', error);
      });
  }

  async sendNewOrder(userId: string, order: Orders) {
    try {
      const msg = `Доброго дня, з'явилось нове повідомлення по Вашому профілю. \n
      Замовник: ${order.name}.
      Дата події: ${order.date}.
      Категорія: ${order.category[0].name}.
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

      this.bot.sendMessage({ id: userId }, [
        new TextMessage(msg),
        new RichMediaMessage(KEYBOARD),
      ]);
    } catch (error) {
      throw new Error(`Помилка надсиланння повідомлення: ${error}`);
    }
  }

  async sendAgreement(phone: string, chatId: string) {
    try {
      const order = await this.orderModel.findOne({ phone: phone });
      const user = await this.userModel.findOne({ viber: chatId });
      const { viber, active, description, tg_chat } = order;
      if (viber !== null && active === true) {
        const msgTrue = `Доброго дня, замовник отримав Вашу відповідь на замовлення:\n"${order.description}".\n \nВ категорії:\n"${order.category[0].name} - ${order.category[0].subcategories[0].name}". \n \nОчікуйте на дзвінок або повідомлення`;
        this.bot.sendMessage({ id: chatId }, [
          new TextMessage(msgTrue),
          new KeyboardMessage(MAIN_KEYBOARD),
        ]);

        const msgOrder =
          `Користувач ${user.firstName} ${user.lastName} готовий виконати ваше замовлення "${description}". \n Посилання на профіль виконавця: ${process.env.FRONT_LINK}${user._id}.\n Ви можете написати йому у вайбер, або зателефонувати по номеру. \n` +
          `\n Телефон: +${user.phone}`;

        await this.bot.sendMessage({ id: viber }, [
          new TextMessage(msgOrder),
          new KeyboardMessage(MAIN_KEYBOARD),
        ]);
        return true;
      } else if (tg_chat !== null && order.active === true) {
        this.telegramService.sendAgreement(order.phone, tg_chat);
      } else if (viber === null && tg_chat === null) {
        const msg = `Замовник ще не активував чат-бот, спробуйте пізніше`;
        this.bot.sendMessage(chatId, msg);
        return false;
      } else {
        const msg = `Замовник призупинив пошук`;
        this.bot.sendMessage(chatId, msg);
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

      http.createServer(this.bot.middleware()).listen(port, () => {
        console.log('Server is running!');
        this.bot.setWebhook(process.env.NOW_URL || process.env.HEROKU_URL);
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

          http.createServer(this.bot.middleware()).listen(port, () => {
            console.log('Server is running!');
            this.bot.setWebhook(publicUrl);
          });
        })
        .catch((error: string) => {
          console.log('Error occurred while connecting to ngrok.');
          console.error(error);
          process.exit(1);
        });
    }
  }
}
