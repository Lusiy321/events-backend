import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as TelegramBot from 'node-telegram-bot-api';
import { Orders } from 'src/orders/order.model';
import { User } from 'src/users/users.model';

@Injectable()
export class TelegramService {
  private bot: TelegramBot;

  constructor(
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
      await this.userModel.findByIdAndUpdate(user._id, { tg_chat: chatId });
      this.bot.sendMessage(
        chatId,
        `Спасибо, ${msg.from.first_name} теперь тебе будут приходить уведомления о новых предложенияех в твоей категории.`,
      );
    });

    this.bot.onText(/\/stop/, async (msg) => {
      const chatId = msg.chat.id;
      const user = await this.userModel.findOne({ tg_chat: chatId }).exec();
      await this.userModel.findByIdAndUpdate(user._id, { tg_chat: null });

      this.bot.sendMessage(chatId, `Вы включили уведомление`);
    });
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
      const result = await this.bot.sendMessage(chatId, msg);
      return result;
    } catch (error) {
      throw new Error(`Ошибка отправки сообщения: ${error}`);
    }
  }
}
