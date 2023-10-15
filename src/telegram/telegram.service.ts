import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as TelegramBot from 'node-telegram-bot-api';
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
                request_contact: true, // Устанавливаем опцию для запроса контакта
              },
            ],
          ],
          one_time_keyboard: true, // Клавиатура исчезнет после нажатия кнопки
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
}
