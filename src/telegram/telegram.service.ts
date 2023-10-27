import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as TelegramBot from 'node-telegram-bot-api';
import { InlineKeyboardMarkup } from 'node-telegram-bot-api';
import { Orders } from 'src/orders/order.model';
import { User } from 'src/users/users.model';

@Injectable()
export class TelegramService {
  private bot: TelegramBot;

  constructor(
    @InjectModel(Orders.name)
    private ordersModel: Orders,
    @InjectModel(User.name)
    private userModel: User,
  ) {
    const token = process.env.BOT_TELEGRAM;
    this.bot = new TelegramBot(token, { polling: true });
    this.bot.setMyCommands([
      { command: '/start', description: 'Старт' },
      { command: '/stop', description: 'Зупинити' },
    ]);

    this.bot.onText(/\/start/, async (msg) => {
      const chatId = msg.chat.id;
      const opts = {
        reply_markup: {
          keyboard: [
            [
              {
                text: 'Запросить номер телефона',
                request_contact: true,
              },
            ],
          ],
          one_time_keyboard: true,
        },
      };
      this.bot.sendMessage(
        chatId,
        'Пожалуйста, нажмите на кнопку "Запросить номер телефона" для предоставления номера телефона.',
        opts,
      );
    });

    this.bot.on('contact', async (msg) => {
      const chatId = msg.chat.id;
      const phoneNumber = msg.contact.phone_number;
      const user = await this.userModel.findOne({ phone: phoneNumber }).exec();
      if (user) {
        await this.userModel.findByIdAndUpdate(user.id, { tg_chat: chatId });
        this.bot.sendMessage(
          chatId,
          `Спасибо, ${msg.from.first_name} теперь тебе будут приходить уведомления о новых предложенияех в твоей категории.`,
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
        this.bot.sendMessage(
          chatId,
          `Спасибо, ${msg.from.first_name} теперь тебе будут приходить уведомления о новых предложенияех в твоей категории.`,
        );
      }
    });

    this.bot.on('callback_query', async (query) => {
      const { data } = query;
      const [action, phone, chatId] = data.split(':');

      if (action === 'accept') {
        await this.sendAgreement(phone, chatId);
      }
    });

    this.bot.onText(/\/stop/, async (msg) => {
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
      this.bot.sendMessage(chatId, `Вы включили уведомление`);
    });
  }

  async sendMessage(chatId: string, msg: string) {
    try {
      const message = await this.bot.sendMessage(chatId, msg);
      return message;
    } catch (error) {
      throw new Error(`Ошибка отправки сообщения: ${error}`);
    }
  }

  async sendAgreement(phone: string, chatId: string) {
    try {
      const order = await this.ordersModel.findOne({ phone: phone });
      const user = await this.userModel.findOne({ tg_chat: chatId });
      const check = !order.tg_chat || order.tg_chat !== null;
      if (check && order.active === true) {
        const msgTrue = `Доброго дня, замовник отримав Вашу відповідь`;
        await this.sendMessage(chatId, msgTrue);
        const msgOrder = `Користувач ${user.firstName} ${user.lastName} готовий виконати ваше замовлення "${order.description}".
      Ви можете написати йому в телеграм @${user.telegram}, або зателефонувати по номеру ${user.phone}.
      Посылання на профіль виконавця ${process.env.FRONT_LINK}${user._id}. ${user.video[0]}`;
        await this.sendMessage(order.tg_chat, msgOrder);
        return;
      } else if (order.tg_chat === null) {
        const msg = `Замовник ще не активував чат-бот, спробуйте пізніше`;
        await this.sendMessage(chatId, msg);
        return;
      } else {
        const msg = `Замовник призупинив пошук`;
        await this.sendMessage(chatId, msg);
        return;
      }
    } catch (e) {
      throw new Error(`Ошибка отправки сообщения: ${e}`);
    }
  }

  async sendNewOrder(chatId: string, order: Orders) {
    try {
      const msg = `Доброго дня, з'явилось нове повідомлення по Вашому профілю. 
      Замовник: ${order.name}.
      Дата події: ${order.date}.
      Категорія: ${order.category[0].name}.
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
              callback_data: 'not',
            },
          ],
        ],
      };
      const result = await this.bot.sendMessage(chatId, msg, {
        reply_markup: keyboard,
      });
      return result;
    } catch (error) {
      throw new Error(`Ошибка отправки сообщения: ${error}`);
    }
  }
}
