import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as TelegramBot from 'node-telegram-bot-api';
export const ViberBot = require('viber-bot').Bot;
const TextMessage = require('viber-bot').Message.Text;
const RichMediaMessage = require('viber-bot').Message.RichMedia;
const KeyboardMessage = require('viber-bot').Message.Keyboard;
const PictureMessage = require('viber-bot').Message.Picture;
const ContactMessage = require('viber-bot').Message.Contact;
import { User } from 'src/users/users.model';
import { Orders } from 'src/orders/order.model';
const ngrok = require('@ngrok/ngrok');
import { newOrderKeyboard, newOrderMsg } from './Telegram/new.order.msg';
import {
  MAIN_KEYBOARD_VIBER,
  findKeyboardViber,
  findMsgViber,
  findOrderKeyboardViber,
  findOrderKeyboardViberActive,
  findUsersKeyboardViber,
  mainKeyboardViber,
  reviewsKeyboard,
  reviewsKeyboardUser,
} from './Viber/main.keyboard';
import { OrdersArchive } from './order.archive.model';
import { Model } from 'mongoose';
import { BadRequest } from 'http-errors';
import {
  contactKeyboard,
  generalKeyboard,
  mainKeyboard,
  msgKeyboardFalse,
  msgKeyboardTrue,
  settingsKeyboard,
} from './Telegram/keyboards_tg';
import {
  newViberKeyboardOrder,
  newViberMsgOrder,
} from './Viber/new.order.msg.viber';

@Injectable()
export class MesengersService {
  private viber_bot: typeof ViberBot;
  private tg_bot: TelegramBot;
  constructor(
    @InjectModel(Orders.name)
    private ordersModel: Orders,
    @InjectModel(OrdersArchive.name)
    private ordersArchiveModel: Model<OrdersArchive>,
    @InjectModel(User.name)
    private userModel: User,
  ) {
    // VIBER BOT CODE START
    this.viber_bot = new ViberBot({
      authToken: process.env.VIBER_ACCESS_TOKEN,
      name: 'Wechirka',
      avatar: process.env.VIBER_AVATAR,
    });

    // MSG ON BOT STARTED
    this.viber_bot.onSubscribe(async (response: any) => {
      const msg = `Привіт, ${response.userProfile.name}!

Вітаємо вас на Wechirka.com! Я - ваш особистий бот, готовий допомагати вам з отриманням сповіщень про замовлення та пропозиції від талановитих виконавців. Щоб не пропустити жодної важливої інформації, надішліть свій номер телефону у форматі 380981231122.

З нетерпінням чекаємо можливості обслуговувати вас та допомагати у здійсненні ваших ідей та проєктів. Бажаємо вам приємного користування нашим ресурсом!

З найкращими побажаннями,
Команда Wechirka.com`;
      this.viber_bot.sendMessage({ id: response.userProfile.id }, [
        new TextMessage(msg),
      ]);
    });

    //MAIN FUNCTION
    this.viber_bot.onTextMessage(/./, async (msg: any, res: any) => {
      try {
        const userProfile = res.userProfile.name;
        const userId = res.userProfile.id;

        const MAIN_KEYBOARD = await mainKeyboardViber(userProfile, userId);

        await this.viber_bot.sendMessage(
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
            const user = await this.userModel.findOne({ viber_chat: chatId });
            user.disagree_order += 1;
            await this.userModel.findByIdAndUpdate(user.id, {
              disagree_order: user.disagree_order,
            });
            await this.viber_bot.sendMessage({ id: chatId }, [
              new TextMessage('Ви не погодились на пропозицію.'),
              new KeyboardMessage(MAIN_KEYBOARD),
            ]);
            break;
          case 'orders':
            await this.myOrdersList(chatId);
            break;
          case 'review':
            await this.myReviewList(chatId);
            break;
          case 'support':
            await this.viber_bot.sendMessage({ id: userId }, [
              new TextMessage(
                ' Перейти у свій профіль WECHIRKA https://www.wechirka.com/profile Написати нам Email support@wechirka.com',
              ),
              new KeyboardMessage(MAIN_KEYBOARD),
            ]);
            break;
          case 'delete':
            const order = await this.ordersModel.findById(phone);
            await this.viber_bot.sendMessage({ id: chatId }, [
              new TextMessage(`Ви видалили замевлення: ${order.description}.`),
              new KeyboardMessage(MAIN_KEYBOARD),
            ]);
            const archivedOrder = new this.ordersArchiveModel(order.toObject());
            await archivedOrder.save();
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
            await this.viber_bot.sendMessage({ id: chatId }, [
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
            await this.viber_bot.sendMessage({ id: chatId }, [
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
              const msgOrder = `Інформація про замовлення:
${findOrder.description}

Замовник: ${findedUser.firstName}
Категорія: ${findedUser.category[0].subcategories[0].name}
Оплата: ${findedUser.price}
Телефон: +${findedUser.phone}

Посилання на профіль виконавця:
${process.env.FRONT_LINK}artists/${findedUser._id}

Будь ласка, зв'яжіться з замовником для уточнення деталей та підтвердження замовлення. Дякуємо за співпрацю!`;
              await this.viber_bot.sendMessage({ id: chatId }, [
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

          if (user && user.viber_chat === null) {
            const updatedUser = await this.userModel.findByIdAndUpdate(
              { _id: user.id },
              {
                viber_chat: res.userProfile.id,
              },
            );
            await updatedUser.save();
            await this.viber_bot.sendMessage({ id: res.userProfile.id }, [
              new TextMessage(
                `Вдячні за реєстрацію, ${res.userProfile.name}! Тепер вам буде надсилатися сповіщення про нові пропозиції у вибраній категорії. Бажаємо приємного користування нашим ресурсом!`,
              ),
              new KeyboardMessage(MAIN_KEYBOARD),
            ]);
            if (order.verify === false) {
              await this.viber_bot.sendMessage({ id: res.userProfile.id }, [
                new TextMessage(
                  `Ваш код підтвердження: ${order.sms}
Перейдіть на сайт для продовження: ${process.env.CODE_LINK}`,
                ),
                new KeyboardMessage(MAIN_KEYBOARD),
              ]);
            }
            return updatedUser;
          }
          if (order && order.viber_chat === null) {
            const updatedOrder = await this.ordersModel.findByIdAndUpdate(
              { _id: order.id },
              {
                viber_chat: res.userProfile.id,
              },
            );
            await updatedOrder.save();
            await this.viber_bot.sendMessage({ id: res.userProfile.id }, [
              new TextMessage(
                `Вдячні за реєстрацію, ${res.userProfile.name}! Тепер вам буде надсилатися сповіщення про нові пропозиції у вибраній категорії. Бажаємо приємного користування нашим ресурсом!`,
              ),
              new KeyboardMessage(MAIN_KEYBOARD),
            ]);
            if (order.verify === false) {
              await this.viber_bot.sendMessage({ id: res.userProfile.id }, [
                new TextMessage(
                  `Ваш код підтвердження: ${order.sms}
Перейдіть на сайт для продовження: ${process.env.CODE_LINK}`,
                ),
                new KeyboardMessage(MAIN_KEYBOARD),
              ]);
            }
            return updatedOrder;
          }

          if (
            (user && user.viber_chat === res.userProfile.id) ||
            (order && order.viber_chat === res.userProfile.id)
          ) {
            if (user) {
              const updatedUser = await this.userModel.findByIdAndUpdate(
                { _id: user.id },
                {
                  viber_chat: null,
                },
              );
              await updatedUser.save();
              await this.viber_bot.sendMessage({ id: res.userProfile.id }, [
                new TextMessage(
                  `${res.userProfile.name}, ви відписалися від отримання сповіщень про нові пропозиції. Якщо у вас знову з'явиться бажання отримувати оновлення, ви можете відновити підписку надіславши свій номер телефону у форматі 380981231122. Бажаємо вам чудового дня!`,
                ),
                new KeyboardMessage(MAIN_KEYBOARD),
              ]);
              return updatedUser;
            } else {
              const updatedOrder = await this.ordersModel.findByIdAndUpdate(
                { _id: order.id },
                {
                  viber_chat: null,
                },
              );

              await updatedOrder.save();
              await this.viber_bot.sendMessage({ id: res.userProfile.id }, [
                new TextMessage(
                  `${res.userProfile.name}, ви відписалися від отримання сповіщень про нові пропозиції. Якщо у вас знову з'явиться бажання отримувати оновлення, ви можете відновити підписку надіславши свій номер телефону у форматі 380981231122. Бажаємо вам чудового дня!`,
                ),
                new KeyboardMessage(MAIN_KEYBOARD),
              ]);
              return updatedOrder;
            }
          }
          if (!user && !order) {
            await this.viber_bot.sendMessage({ id: res.userProfile.id }, [
              new TextMessage(
                `Користувач з номером +${phoneNumber} не зареєстрований у нашій системі. Будь ласка, перевірте введений номер телефону та, за необхідності, зареєструйтеся на нашому сайті. Якщо у вас виникли труднощі, зверніться до служби підтримки https://www.wechirka.com`,
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
      .then(async (response: any) => console.log(`Bot Named: ${response.name}`))
      .catch((error: any) => {
        console.error('Error while getting bot profile:', error);
      });
    // VIBER BOT CODE END

    //TELEGRAM BOT CODE START
    const token = process.env.BOT_TELEGRAM;
    this.tg_bot = new TelegramBot(token, { polling: true });

    // KEYBOARDS

    // START BOT
    this.tg_bot.onText(/\/start/, async (msg) => {
      try {
        const chatId = msg.chat.id;
        await this.tg_bot.sendMessage(
          chatId,
          `Привіт, ${msg.from.first_name}!

Вітаємо вас на Wechirka.com! Я - ваш особистий бот, готовий допомагати вам з отриманням сповіщень про замовлення та пропозиції від талановитих виконавців. Щоб не пропустити жодної важливої інформації, натисніть кнопку "Відправити номер телефону" і здійсніть реєстрацію у нашому боті.

З нетерпінням чекаємо можливості обслуговувати вас та допомагати у здійсненні ваших ідей та проєктів. Бажаємо вам приємного користування нашим ресурсом!

З найкращими побажаннями 🚀,
Команда Wechirka.com`,
          contactKeyboard,
        );
      } catch (e) {
        throw new Error(`Помилка надсилання повідомлення: ${e}`);
      }
    });

    this.tg_bot.onText(/Замовлення/, async (msg) => {
      try {
        const chatId = msg.chat.id;
        const user = await this.userModel.findOne({ tg_chat: chatId }).exec();
        const find = await this.ordersModel.find({ tg_chat: chatId }).exec();
        if (!user && Array.isArray(find) && find.length === 0) {
          await this.tg_bot.sendMessage(
            chatId,
            'Ми не знайшли ваші заявки, імовірно, ви ще не зареєстровані. Будь ласка, натисніть кнопку "Відправити номер телефону" для реєстрації у боті та отримання доступу до всіх можливостей нашого сервісу. Якщо у вас є будь-які питання, не соромтеся звертатися. Бажаємо вам приємного користування!',
            generalKeyboard,
          );
        }
        if (user && Array.isArray(find) && find.length === 0) {
          await this.tg_bot.sendMessage(
            chatId,
            'Схоже, що у вас немає зареєстрованого замовлення. Якщо ви замовник, Будь ласка, натисніть кнопку "Відправити номер телефону" для реєстрації і отримання доступу до послуг та можливостей нашого сервісу. Якщо ви маєте будь-які інші питання, не соромтеся питати. Дякуємо за розуміння!',
            generalKeyboard,
          );
        }
        if (find || user.tg_chat === find[0].tg_chat) {
          find.map(async (finded: Orders) => {
            const msg = await findMsgViber(finded);
            if (finded.active === true) {
              const keyboard = await msgKeyboardFalse(finded, chatId);
              await this.tg_bot.sendMessage(chatId, msg, {
                reply_markup: keyboard,
              });
            } else {
              const keyboard = await msgKeyboardTrue(finded, chatId);
              await this.tg_bot.sendMessage(chatId, msg, {
                reply_markup: keyboard,
              });
            }
          });
        }
      } catch (e) {
        throw new Error(`Помилка надсилання повідомлення: ${e}`);
      }
    });

    this.tg_bot.onText(/Відгуки/, async (msg) => {
      try {
        const chatId = msg.chat.id;
        const user = await this.userModel.findOne({ tg_chat: chatId }).exec();

        if (!user) {
          await this.tg_bot.sendMessage(
            chatId,
            'Схоже, що у вас немає зареєстрованого облікового запису як виконавця.Якщо Ви зарєєструвались як виконавець, Будь ласка, натисніть кнопку "Відправити номер телефону" для реєстрації як виконавець та отримання доступу до можливостей нашого сервісу. Якщо у вас є будь-які інші питання, не соромтеся питати. Дякуємо за розуміння!',
            generalKeyboard,
          );
        }
        if (
          user &&
          Array.isArray(user.accepted_orders) &&
          user.accepted_orders.length === 0
        ) {
          await this.tg_bot.sendMessage(
            chatId,
            'Схоже, що у нашій системі відсутні відгуки від вас на пропозиції замовників. Якщо у вас виникнуть будь-які труднощі або питання, не соромтеся звертатися до нас. Дякуємо за розуміння!',
            generalKeyboard,
          );
        }
        if (
          user &&
          Array.isArray(user.accepted_orders) &&
          user.accepted_orders.length !== 0
        ) {
          try {
            user.accepted_orders.map(async (finded: Orders) => {
              const findetOrder = await this.ordersModel.findOne({
                _id: finded,
              });
              const msg = await findMsgViber(findetOrder);
              await this.tg_bot.sendMessage(chatId, msg, contactKeyboard);
            });
          } catch (e) {
            return await this.tg_bot.sendMessage(chatId, e, contactKeyboard);
          }
        }
      } catch (e) {
        throw new Error(`Помилка надсилання повідомлення: ${e}`);
      }
    });

    this.tg_bot.onText(/Головна/, async (msg: any) => {
      const chatId = msg.chat.id;
      this.tg_bot.sendMessage(chatId, '🔔', mainKeyboard);
    });

    this.tg_bot.onText(/Налаштування/, async (msg: any) => {
      const chatId = msg.chat.id;
      this.tg_bot.sendMessage(chatId, '🔍', settingsKeyboard);
    });

    this.tg_bot.onText(/Підтримка/, async (msg: any) => {
      const chatId = msg.chat.id;
      this.tg_bot.sendMessage(
        chatId,
        '\n<a href="https://www.wechirka.com/">Перейти на WECHIRKA</a> \n\n<a href="https://t.me/+tG6pSpHWPPFiYzMy">Написати нам у Телеграм</a> \n\nНаписати нам Email support@wechirka.com',
        { parse_mode: 'HTML' },
      );
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
            `Дякуємо, ${msg.from.first_name}! Тепер вам будуть надходити повідомлення про нові пропозиції в обраній категорії. Щоб вимкнути оповіщення, виберіть "Меню" та натисніть /stop. Якщо у вас є будь-які питання або потребуєте додаткової допомоги, не соромтеся звертатися!`,
            mainKeyboard,
          );
        }
        if (order && order.tg_chat === null) {
          await this.ordersModel.findByIdAndUpdate(order.id, {
            tg_chat: chatId,
          });
          await this.tg_bot.sendMessage(
            chatId,
            `Дякуємо, ${msg.from.first_name}! Тепер вам будуть надходити повідомлення про нові пропозиції в обраній категорії. Щоб вимкнути оповіщення, виберіть "Меню" та натисніть /stop. Якщо у вас є будь-які питання або потребуєте додаткової допомоги, не соромтеся звертатися!`,
            mainKeyboard,
          );
          if (order.verify === false) {
            await this.tg_bot.sendMessage(
              chatId,
              `Ваш код підтвердження: ${order.sms}
Перейдіть на сайт за посиланням: ${process.env.CODE_LINK}`,
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
              await this.tg_bot.editMessageText(msg, {
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
            await this.tg_bot.sendMessage(
              chatId,
              `Ви відмовились від виконання замовлення: ${orders.description}.`,
              mainKeyboard,
            );
            break;
          case 'delete':
            const delOrder = await this.ordersModel.findById(phone);
            await this.tg_bot.sendMessage(
              chatId,
              `Ви видалили замевлення: ${delOrder.description}.`,
              mainKeyboard,
            );
            const archivedOrder = new this.ordersArchiveModel(
              delOrder.toObject(),
            );
            await archivedOrder.save();
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
            await this.tg_bot.sendMessage(
              chatId,
              `Ви активували замевлення: ${actiOrder.description}.`,
              mainKeyboard,
            );

            break;
          case 'deactive':
            const deactiOrder = await this.ordersModel.findById(phone);
            await this.ordersModel.findByIdAndUpdate(deactiOrder.id, {
              active: false,
            });
            await this.tg_bot.sendMessage(
              chatId,
              `Ви деактивували замевлення: ${deactiOrder.description}.`,
              mainKeyboard,
            );
            break;
          case 'users':
            const findOrder = await this.ordersModel.findOne({ _id: phone });
            if (findOrder.accepted_users.length === 0) {
              await this.tg_bot.sendMessage(
                chatId,
                `На жаль, немає жодних відгуків на цю пропозицію.`,
                mainKeyboard,
              );
            } else {
              findOrder.accepted_users.map(async (user: any) => {
                const findedUser = await this.userModel.findOne({ _id: user });
                const msgOrder = `Замовлення:\n${findOrder.description}\nКористувач: ${findedUser.firstName}.\nКатегорія: ${findedUser.category[0].subcategories[0].name}\nОплата: ${findedUser.price}\nТелефон: +${findedUser.phone}.\nПосилання на профіль:\n${process.env.FRONT_LINK}artists/${findedUser._id}.`;
                await this.tg_bot.sendMessage(chatId, msgOrder);
              });
              await this.tg_bot.sendMessage(chatId, '', mainKeyboard);
            }
            break;
          default:
            break;
        }
      } catch (e) {
        console.log(e);
      }
    });

    this.tg_bot.onText(/Зупинити оповіщення/, async (msg) => {
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
      await this.tg_bot.sendMessage(
        chatId,
        `Ви призупинили отримання сповіщень. Для їх відновлення, будь ласка, натисніть кнопку "Відправити номер телефону".`,
        generalKeyboard,
      );
    });
  }
  // VIBER METHODS ON CLASS ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  async sendNewViberOrder(userId: string, order: Orders) {
    try {
      const msg = await newViberMsgOrder(order);
      const KEYBOARD = await newViberKeyboardOrder(userId, order);
      await this.viber_bot.sendMessage({ id: userId }, [
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
      const user = await this.userModel.findOne({ viber_chat: userChatId });

      const { viber_chat, active, description, tg_chat } = order;
      const { firstName, phone, _id } = user;

      const accept = user.accepted_orders;
      if (accept.includes(order._id)) {
        const msg = `Ви вже прийняли це замовлення.`;
        await this.viber_bot.sendMessage({ id: userChatId }, [
          new TextMessage(msg),
          new KeyboardMessage(MAIN_KEYBOARD_VIBER),
        ]);
        return false;
      } else if (viber_chat !== null && active === true) {
        const msgTrue = `
Доброго дня!

Замовник отримав вашу відповідь на замовлення:
"${order.description}".

Ваш профіль представлений в категорії:
"${order.category[0].name} - ${order.category[0].subcategories[0].name}".

Якщо ваш профіль сподобався замовнику, він з вами зв'яжеться. Очікуйте на дзвінок або повідомлення. Бажаємо успіхів у співпраці!`;
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
        await this.viber_bot.sendMessage({ id: userChatId }, [
          new TextMessage(msgTrue),
          new KeyboardMessage(MAIN_KEYBOARD_VIBER),
        ]);
        const msgOrder =
          `Користувач *${firstName}* готовий виконати ваше замовлення "*${description}*". \n Посилання на профіль виконавця: ${process.env.FRONT_LINK}artists/${_id}.\n Ви можете зв'язатися з ним, написавши повідомлення або скориставшись телефоном. \n` +
          `\n Телефон: +${phone}`;

        await this.viber_bot.sendMessage({ id: viber_chat }, [
          new PictureMessage(user.master_photo.url),
          new TextMessage(msgOrder),
          new KeyboardMessage(MAIN_KEYBOARD_VIBER),
        ]);
        return true;
      } else if (tg_chat !== null && order.active === true) {
        const msgOrder = `Користувач ${user.firstName} готовий виконати ваше замовлення "${order.description}". Зв'яжіться з ним за номером +${user.phone} або перегляньте його профіль тут: ${process.env.FRONT_LINK}artists/${user._id}.`;
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

        const msgTrue = `Доброго дня!

Замовник отримав вашу відповідь на замовлення:
"${order.description}".

Ваш профіль представлений в категорії:
"${order.category[0].name} - ${order.category[0].subcategories[0].name}".

Якщо ваш профіль сподобався замовнику, він з вами зв'яжеться. Очікуйте на дзвінок або повідомлення. Бажаємо успіхів у співпраці!`;
        await this.viber_bot.sendMessage({ id: userChatId }, [
          new TextMessage(msgTrue),
          new KeyboardMessage(MAIN_KEYBOARD_VIBER),
        ]);
      } else if (viber_chat === null && tg_chat === null) {
        const msg = `Вибачте за незручності, але замовник ще не активував чат-бот. Спробуйте звернутися пізніше.`;
        await this.viber_bot.sendMessage(userChatId, msg);
        return false;
      } else {
        const msg = `Замовник призупинив пошук`;
        await this.viber_bot.sendMessage(userChatId, msg);
        return true;
      }
    } catch (e) {
      throw new Error(`Помилка надсилання повідомлення: ${e}`);
    }
  }

  async myOrdersList(chatId: string) {
    try {
      const user = await this.userModel.findOne({ viber_chat: chatId }).exec();
      const find = await this.ordersModel.find({ viber_chat: chatId }).exec();

      if (
        user &&
        user.viber_chat !== null &&
        Array.isArray(find) &&
        find.length === 0
      ) {
        await this.viber_bot.sendMessage(
          { id: chatId },
          new TextMessage(
            'Вибачте за непорозуміння, але здається, що ви не зареєстровані як замовник. Якщо ви є замовником, будь ласка, відправте свій номер телефону у форматі 380981231122. Дякуємо за розуміння!',
          ),
        );
      }
      if (!user && Array.isArray(find) && find.length === 0) {
        await this.viber_bot.sendMessage(
          { id: chatId },
          new TextMessage(
            'Вибачте за непорозуміння, але здається, що ми не знайшли ваші заявки, імовірно, ви ще не зареєструвалися у чат-боті. Будь ласка, відправте свій номер телефону у форматі 380981231122 для реєстрації та доступу до наших послуг. Дякуємо за розуміння!',
          ),
        );
      }
      if (find || user.viber_chat === find[0].viber_chat) {
        find.map(async (finded: Orders) => {
          const FIND_KEYBOARD = await findKeyboardViber(finded, chatId);
          const msg = await findMsgViber(finded);
          if (finded.active === true) {
            const KEYBOARD = await findOrderKeyboardViber(finded);
            const USERS = await findUsersKeyboardViber(finded);
            await this.viber_bot.sendMessage({ id: chatId }, [
              new TextMessage(msg),
              new RichMediaMessage(KEYBOARD, USERS),
              new RichMediaMessage(USERS),
              new KeyboardMessage(FIND_KEYBOARD),
            ]);
          } else {
            const KEYBOARD = await findOrderKeyboardViberActive(finded);
            const USERS = await findUsersKeyboardViber(finded);
            await this.viber_bot.sendMessage({ id: chatId }, [
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
      const user = await this.userModel.findOne({ viber_chat: chatId }).exec();
      const KEYBOARD = await reviewsKeyboard(chatId);

      if (
        user &&
        user.viber_chat !== null &&
        Array.isArray(user.accepted_orders) &&
        user.accepted_orders.length === 0
      ) {
        await this.viber_bot.sendMessage({ id: chatId }, [
          new TextMessage(
            'На жаль, ми не знайшли ваших відгуків на це замовлення.',
          ),
          new KeyboardMessage(KEYBOARD),
        ]);
      }
      if (!user) {
        await this.viber_bot.sendMessage({ id: chatId }, [
          new TextMessage(
            'Ми не знайшли ваших відгуків, імовірно, ви ще не зареєструвалися як виконавець. Будь ласка, зареєструйте свій профіль для можливості надавати відгуки та користуватися нашими сервісами. Якщо у вас є будь-які питання або потребуєте додаткової допомоги, не соромтеся звертатися до нас. Дякуємо за розуміння!',
          ),
          new KeyboardMessage(KEYBOARD),
        ]);
      }
      if (
        user &&
        Array.isArray(user.accepted_orders) &&
        user.accepted_orders.length !== 0
      ) {
        const orederArr = user.accepted_orders;
        orederArr.map(async (finded: Orders) => {
          const myOrders = await this.ordersModel.findOne({ _id: finded });
          const FIND_KEYBOARD = await reviewsKeyboardUser(user);
          const msg = await findMsgViber(myOrders);
          await this.viber_bot.sendMessage({ id: chatId }, [
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
    try {
      const allOrders = await this.ordersModel
        .find({})
        .select('viber_chat')
        .exec();
      const allUsers = await this.userModel
        .find({})
        .select('viber_chat')
        .exec();

      const allViberUsers = allOrders.concat(allUsers);
      allViberUsers.map(async (user: any) => {
        if (user.viber_chat !== null) {
          await this.viber_bot.sendMessage({ id: user.viber_chat }, [
            new TextMessage(msg),
            new KeyboardMessage(MAIN_KEYBOARD_VIBER),
          ]);
        }
      });
    } catch (error) {
      throw new Error(`Помилка надсилання повідомлення: ${error}`);
    }
  }

  async sendMessageViber(chatId: string, msg: string) {
    try {
      const message = await this.viber_bot.sendMessage({ id: chatId }, [
        new TextMessage(msg),
        new KeyboardMessage(MAIN_KEYBOARD_VIBER),
      ]);
      return message;
    } catch (error) {
      throw new Error(`Помилка надсилання повідомлення: ${error}`);
    }
  }

  async startServer() {
    const http = require('http');
    const port = 10000;
    try {
      await ngrok
        .connect({
          addr: port,
          authtoken_from_env: true,
        })
        .then(async (listener: any) => {
          console.log('publicUrl => ', listener.url());
          await http
            .createServer(await this.viber_bot.middleware())
            .listen(
              port,
              async () => await this.viber_bot.setWebhook(listener.url()),
            );
        });
    } catch (error) {
      console.log('Can not connect to ngrok server.');
      console.error(error);
    }
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
    allTgUsers.map(async (user: any) => {
      if (user.tg_chat !== null) {
        await this.sendMessageTg(user.tg_chat.toString(), msg);
      }
    });
  }

  async sendCode(chatId: string, code: number) {
    try {
      const telegram = await this.ordersModel.findOne({ tg_chat: chatId });
      const viber = await this.ordersModel.findOne({ viber_chat: chatId });

      if (telegram) {
        const msg = `Ваш код підтвердження: ${code}
Перейдіть на сайт за посиланням: ${process.env.CODE_LINK}`;
        await this.sendMessageTg(chatId, msg);
      } else if (viber) {
        const msg = `Ваш код підтвердження: ${code}
Перейдіть на сайт за посиланням: ${process.env.CODE_LINK}`;
        await this.viber_bot.sendMessage(
          { id: chatId },
          new TextMessage(msg),
          new KeyboardMessage(MAIN_KEYBOARD_VIBER),
        );
      } else {
        throw new Error(`Помилка надсилання повідомлення`);
      }
    } catch (e) {
      throw e;
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
        const msgTrue = `Доброго дня!

Замовник отримав вашу відповідь на замовлення:
"${order.description}".

Ваш профіль представлений в категорії:
"${order.category[0].name} - ${order.category[0].subcategories[0].name}".

Якщо ваш профіль сподобався замовнику, він з вами зв'яжеться. Очікуйте на дзвінок або повідомлення. Бажаємо успіхів у співпраці!`;
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

Ви можете зв'язатися з ним, написавши повідомлення або зателефонувавши за номером +${user.phone}.

Посилання на профіль виконавця: ${process.env.FRONT_LINK}artists/${user._id}.`;
        await this.sendMessageTg(order.tg_chat.toString(), msgOrder);
        if (user.photo.length > 0 || user.video.length > 0) {
          const images = user.photo.map((photos: any) => ({
            type: 'photo',
            media: photos.url,
          }));
          await this.tg_bot.sendMediaGroup(order.tg_chat.toString(), images);
          const videos = user.video.map((video: any) => ({
            type: 'video',
            media: video.url,
          }));
          await this.tg_bot.sendMediaGroup(order.tg_chat.toString(), videos);
        }

        return true;
      } else if (order.viber_chat !== null && order.active === true) {
        const msgOrder =
          `Користувач ${user.firstName} готовий виконати ваше замовлення "${order.description}". \n Посилання на профіль виконавця: ${process.env.FRONT_LINK}artists/${user._id}.\n Ви можете написати йому, або зателефонувати по номеру. \n` +
          `\n Телефон: +${user.phone}`;

        await this.viber_bot.sendMessage({ id: order.viber_chat }, [
          new TextMessage(msgOrder),
          new PictureMessage(user.master_photo.url),
          new ContactMessage(user.firstName, user.phone),
          new KeyboardMessage(MAIN_KEYBOARD_VIBER),
        ]);
        if (user.photo.length > 0 || user.video.length > 0) {
          user.photo.map(async (photos: any) => {
            await this.viber_bot.sendMessage(
              { id: order.viber_chat },
              new PictureMessage(photos.url),
            );
          });
          user.video.map(async (videos: any) => {
            await this.viber_bot.sendMessage(
              { id: order.viber_chat },
              new TextMessage(videos.url),
            );
          });
        }

        const msgTrue = `Доброго дня, замовник отримав Вашу відповідь на замовлення:\n"${order.description}".\n \nВ категорії:\n"${order.category[0].name} - ${order.category[0].subcategories[0].name}". \n \nЯкщо ваш профіль сподобався замовнику, він з вами зв'яжеться. Очікуйте на дзвінок або повідомлення. Бажаємо успіхів у співпраці!`;
        await this.sendMessageTg(chatId, msgTrue);
        order.approve_count = +1;
        await this.ordersModel.findByIdAndUpdate(order.id, {
          approve_count: order.approve_count,
        });
        return true;
      } else if (order.tg_chat === null && order.viber_chat === null) {
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

  async sendNewTgOrder(chatId: number, order: Orders) {
    try {
      const msg = newOrderMsg(order);
      const keyboard = newOrderKeyboard(order, chatId);
      const result = await this.tg_bot.sendMessage(chatId, msg, {
        reply_markup: keyboard,
      });
      return result;
    } catch (error) {
      throw new BadRequest(`Помилка надсиланння повідомлення: ${error}`);
    }
  }
}
