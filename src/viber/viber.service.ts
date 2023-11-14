import { Injectable } from '@nestjs/common';
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
import { Viber } from './viber.model';
import { User } from 'src/users/users.model';
import { Orders } from 'src/orders/order.model';
const ngrok = require('ngrok');

@Injectable()
export class ViberService {
  private app: express.Express;
  private bot: typeof ViberBot;
  constructor(
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
    const userProfile = {
      id: 'SGznWkU3DQy/H7jnGTnLwA==',
      name: 'Владимир',
      avatar:
        'https://media-direct.cdn.viber.com/download_photo?dlid=-NN71zPkZ9zeF8VRrLdFoDfPuw3rjcoiZWKKz_MdqLrReyz1x9OVS9WwNzMNNSF62GuixjWJSTrWc4CoKlhBvy5Bwt2lRvGAvhqToJds84YMhzfetBcxWUZduSg6Ec9wXke9Dg&fltp=jpg&imsz=0000',
      country: 'UA',
      language: 'ru',
      apiVersion: 10,
    };

    function say(response: any, message: any) {
      response.send(new TextMessage(message));
    }

    this.bot.onTextMessage(/./, async (msg: any, res: any) => {
      try {
        const messageText = msg.text;
        const phoneNumber = parseInt(messageText);
        const order = await this.orderModel.findById(
          '652eae0dee939a130c084e21',
        );
        this.sendNewOrder(res.userProfile.id, order);
        const actionBody = msg.text;
        const [action, phone, chatId] = actionBody.split(':');
        switch (action) {
          case 'accept':
            // Обработка, если нажата кнопка "Согласен"
            say(res, 'Вы согласились.');
            break;

          case 'disagree':
            // Обработка, если нажата кнопка "Не согласен"
            say(res, 'Вы не согласились.');
            break;

          // Добавьте другие кейсы по мере необходимости

          default:
            // Обработка для других случаев
            break;
        }
        if (!isNaN(phoneNumber) && phoneNumber.toString().length === 12) {
          const user = await this.userModel.find({ phone: phoneNumber });
          if (Array.isArray(user) && user.length === 0) {
            const order = await this.orderModel.find({ phone: phoneNumber });
            if (Array.isArray(order) && order.length === 0) {
              say(
                res,
                `${res.userProfile.name}, Ми не знайшли Ваш номер в базі`,
              );
            } else if (order.vibe === null) {
              order.viber = res.userProfile.id;
              say(
                res,
                `Дякую, ${res.userProfile.name} теперь тобі будуть надходити сповіщення про нові пропозиції твоїй категорії.`,
              );
            } else {
              order.viber = null;
              say(
                res,
                `${res.userProfile.name}, Ви відписалися від сповіщення про нові пропозиції твоїй категорії.`,
              );
            }
          } else if (user.vibe === null) {
            user.viber = res.userProfile.id;
            say(
              res,
              `Дякую, ${res.userProfile.name} теперь тобі будуть надходити сповіщення про нові пропозиції твоїй категорії.`,
            );
          } else {
            user.viber = null;
            say(
              res,
              `${res.userProfile.name} відписалися від сповіщення про нові пропозиції твоїй категорії.`,
            );
          }
        } else {
          say(
            res,
            'Ви ввели не корректний номер телефону. Якщо ви вже підписані на сповіщення, та хочете відписатися, введіть свій номер телефону',
          );
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
      const msg = `Доброго дня, з'явилось нове повідомлення по Вашому профілю. \nn
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
