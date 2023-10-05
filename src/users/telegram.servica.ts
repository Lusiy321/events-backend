import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TelegramService {
  private bot: TelegramBot;

  constructor() {
    const token = process.env.BOT_TELEGRAM;
    this.bot = new TelegramBot(token, { polling: true });
    this.bot.setMyCommands([
      { command: '/start', description: 'Старт' },
      { command: '/set', description: 'Настройки' },
    ]);
    this.bot.onText(/\/start/, async (msg) => {
      const chatId = msg.chat.id;
      console.log(`New user ${msg.from.first_name} connected`);
      this.bot.sendMessage(
        chatId,
        `Привет ${msg.from.first_name} теперь тебе будут приходить уведомления`,
      );
    });
  }

  async sendMessage(chatId: number, message: string) {
    try {
      await this.bot.sendMessage(chatId, message);
      console.log('Сообщение успешно отправлено в Telegram.');
    } catch (e) {
      console.log(e);
    }
  }
}
