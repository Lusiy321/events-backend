// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import * as TelegramBot from 'node-telegram-bot-api';
// import { InlineKeyboardMarkup } from 'node-telegram-bot-api';
// import { Orders } from 'src/orders/order.model';
// import { User } from 'src/users/users.model';

// @Injectable()
// export class TelegramService {
//   private tg_bot: TelegramBot;

//   constructor(
//     @InjectModel(Orders.name)
//     private ordersModel: Orders,
//     @InjectModel(User.name)
//     private userModel: User,
//   ) {
//     const token = process.env.BOT_TELEGRAM;
//     this.tg_bot = new TelegramBot(token, { polling: true });
//     this.tg_bot.setMyCommands([
//       { command: '/stop', description: 'Зупинити оповіщення' },
//     ]);

//     this.tg_bot.onText(/\/start/, async (msg) => {
//       const chatId = msg.chat.id;
//       const opts = {
//         reply_markup: {
//           keyboard: [
//             [
//               {
//                 text: 'Відправити номер телефону',
//                 request_contact: true,
//               },
//             ],
//           ],
//           one_time_keyboard: true,
//         },
//       };
//       this.tg_bot.sendMessage(
//         chatId,
//         'Будь ласка, натисніть кнопку "Відправити номер телефону" для надання номеру телефону.',
//         opts,
//       );
//     });

//     this.tg_bot.on('contact', async (msg) => {
//       const chatId = msg.chat.id;
//       const phoneNumber = msg.contact.phone_number;
//       const user = await this.userModel.findOne({ phone: phoneNumber }).exec();
//       if (user) {
//         await this.userModel.findByIdAndUpdate(user.id, { tg_chat: chatId });
//         this.tg_bot.sendMessage(
//           chatId,
//           `Дякую, ${msg.from.first_name} тепер тобі будуть надходити повідомлення про нові пропозиції в твоїй категорії.`,
//         );
//       } else {
//         const order = await this.ordersModel
//           .findOne({ phone: phoneNumber })
//           .exec();
//         if (order) {
//           await this.ordersModel.findByIdAndUpdate(order.id, {
//             tg_chat: chatId,
//           });
//         }
//         this.tg_bot.sendMessage(
//           chatId,
//           `Дякую, ${msg.from.first_name} тепер тобі будуть надходити повідомлення про нові пропозиції в твоїй категорії.`,
//         );
//       }
//     });

//     this.tg_bot.on('callback_query', async (query) => {
//       const { data } = query;
//       const [action, phone, chatId] = data.split(':');

//       if (action === 'accept') {
//         const order = await this.sendTgAgreement(phone, chatId);
//         if (order === true) {
//           const msg = `${query.message.text} Ви погодились на це замовлення \n`;
//           this.tg_bot.editMessageText(msg, {
//             chat_id: chatId,
//             message_id: query.message.message_id,
//           });
//         }
//       }
//     });

//     this.tg_bot.onText(/\/stop/, async (msg) => {
//       const chatId = msg.chat.id;
//       const user = await this.userModel.findOne({ tg_chat: chatId }).exec();
//       if (user) {
//         await this.userModel.findByIdAndUpdate(user.id, { tg_chat: null });
//       } else {
//         const order = await this.ordersModel
//           .findOne({ tg_chat: chatId })
//           .exec();
//         if (order) {
//           await this.ordersModel.findByIdAndUpdate(order.id, { tg_chat: null });
//         }
//       }
//       this.tg_bot.sendMessage(chatId, `Ви ввімкнули повідомлення`);
//     });
//   }

//   async sendMessage(chatId: string, msg: string) {
//     try {
//       const message = await this.tg_bot.sendMessage(chatId, msg);
//       return message;
//     } catch (error) {
//       throw new Error(`Помилка надсилання повідомлення: ${error}`);
//     }
//   }

//   async sendTgAgreement(phone: string, chatId: string) {
//     try {
//       const order = await this.ordersModel.findOne({ phone: phone });
//       const user = await this.userModel.findOne({ tg_chat: chatId });
//       if (order.tg_chat !== null && order.active === true) {
//         const msgTrue = `Доброго дня, замовник отримав Вашу відповідь на замовлення:\n"${order.description}".\n \nВ категорії:\n"${order.category[0].name} - ${order.category[0].subcategories[0].name}". \n \nОчікуйте на дзвінок або повідомлення`;
//         await this.sendMessage(chatId, msgTrue);
//         const msgOrder = `Виконавець ${user.firstName} готовий виконати ваше замовлення "${order.description}".
//       Ви можете написати йому в телеграм @${user.telegram}, або зателефонувати по номеру ${user.phone}. \n
//       Посилання на профіль виконавця ${process.env.FRONT_LINK}${user._id}. ${user.video[0]}`;
//         await this.sendMessage(order.tg_chat, msgOrder);
//         return true;
//       } else if (order.viber !== null && order.active === true) {
//       } else if (order.tg_chat === null && order.viber === null) {
//         const msg = `Замовник ще не активував чат-бот, спробуйте пізніше`;
//         await this.sendMessage(chatId, msg);
//         return false;
//       } else {
//         const msg = `Замовник призупинив пошук`;
//         await this.sendMessage(chatId, msg);
//         return true;
//       }
//     } catch (e) {
//       throw new Error(`Помилка надсилання повідомлення: ${e}`);
//     }
//   }

//   async sendNewTgOrder(chatId: string, order: Orders) {
//     try {
//       const msg = `Доброго дня, з'явилось нове повідомлення за Вашим профілем.
//       Замовник: ${order.name}.
//       Дата події: ${order.date}.
//       Категорія: ${order.category[0].name}.
//       Вимоги замовника: ${order.description}.
//       Локація: ${order.location}.
//       Гонорар: ${order.price}`;
//       const keyboard: InlineKeyboardMarkup = {
//         inline_keyboard: [
//           [
//             {
//               text: 'Згоден',
//               callback_data: `accept:${order.phone}:${chatId}`,
//             },
//             {
//               text: 'Не цікаво',
//               callback_data: 'disagree',
//             },
//           ],
//         ],
//       };
//       const result = await this.tg_bot.sendMessage(chatId, msg, {
//         reply_markup: keyboard,
//       });
//       return result;
//     } catch (error) {
//       throw new Error(`Помилка надсиланння повідомлення: ${error}`);
//     }
//   }
// }
