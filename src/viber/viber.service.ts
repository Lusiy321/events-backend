import { Injectable } from '@nestjs/common';
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
const ngrok = require('ngrok');

@Injectable()
export class ViberService {
  private app: express.Express;
  private bot: typeof ViberBot;
  constructor() {
    this.bot = new ViberBot({
      authToken: process.env.VIBER_ACCESS_TOKEN,
      name: 'Wechirka',
      avatar:
        'https://raw.githubusercontent.com/devrelv/drop/master/151-icon.png',
    });
    // this.bot.onSubscribe(async (response: any) => {
    //   response.say(
    //     response,
    //     `Привіт ${response.userProfile.name}. Я бот ресурсу ${this.bot.name}! Щоб отримувати сповіщеня, натисніть кнопку "відправити контакт" у меню з низу. Сюди будуть надходити сповіщеня про найм`,
    //   );
    // });

    // this.bot.onTextMessage(/./, async (msg, res) => {
    //   if (msg.text === 'Підписатися') {
    //     res.send(
    //       `${res.userProfile.name} введіть свій номер телефону у форматі 380981231122`,
    //     );
    //     return;
    //   }
    // });
    this.bot
      .getBotProfile()
      .then((response: any) => console.log(`Bot Named: ${response.name}`))
      .catch((error: any) => {
        console.error('Error while getting bot profile:', error);
      });
  }

  handleIncomingMessage(message: any, response: any): void {
    // Обработка входящего сообщения
    if (message.text === 'Підписатися') {
      console.log(message.text);
      this.sendSubscriptionPrompt(response);
    } else {
      this.sendDefaultResponse(response, message.text);
    }
  }

  private sendDefaultResponse(response: any, text: string): void {
    if (text === 'text') {
      // Отправить текстовое сообщение
      // Пример: response.sendTextMessage(text);
    } else if (text === 'url') {
      // Отправить URL-сообщение
      // Пример: response.sendUrlMessage(url);
    } else if (text === 'contact') {
      // Отправить сообщение с контактом
      // Пример: response.sendContactMessage(contactName, contactPhoneNumber);
    } else {
      // Обработка остальных вариантов
      // Пример: response.sendTextMessage('Непонятный запрос');
    }
  }

  private sendSubscriptionPrompt(response: any): void {
    // Отправить сообщение с просьбой о подписке
    response.sendTextMessage('Введите ваш номер телефона для подписки');
  }

  startServer() {
    if (process.env.NOW_URL || process.env.HEROKU_URL) {
      const http = require('http');
      const port = 1869;

      http
        .createServer(this.bot.middleware())
        .listen(port, () =>
          this.bot.setWebhook(process.env.NOW_URL || process.env.HEROKU_URL),
        );
    } else {
      return ngrok
        .connect({
          addr: 1869,
        })
        .then(async (publicUrl: string) => {
          const http = require('http');
          const port = 1869;

          console.log('publicUrl => ', publicUrl);

          await http
            .createServer(this.bot.middleware())
            .listen(port, () => this.bot.setWebhook(publicUrl));
        })
        .catch((error: string) => {
          console.log('Can not connect to ngrok server. Is it running?');
          console.error(error);
          process.exit(1);
        });
    }
  }
}
