"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const TelegramBot = require("node-telegram-bot-api");
const order_model_1 = require("../orders/order.model");
const users_model_1 = require("../users/users.model");
let TelegramService = class TelegramService {
    constructor(ordersModel, userModel) {
        this.ordersModel = ordersModel;
        this.userModel = userModel;
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
                                text: 'Відправити номер телефону',
                                request_contact: true,
                            },
                        ],
                    ],
                    one_time_keyboard: true,
                },
            };
            this.bot.sendMessage(chatId, 'Будь ласка, натисніть кнопку "Відправити номер телефону" для надання номеру телефону.', opts);
        });
        this.bot.on('contact', async (msg) => {
            const chatId = msg.chat.id;
            const phoneNumber = msg.contact.phone_number;
            const user = await this.userModel.findOne({ phone: phoneNumber }).exec();
            if (user) {
                await this.userModel.findByIdAndUpdate(user.id, { tg_chat: chatId });
                this.bot.sendMessage(chatId, `Дякую, ${msg.from.first_name} тепер тобі будуть надходити повідомлення про нові пропозиції в твоїй категорії.`);
            }
            else {
                const order = await this.ordersModel
                    .findOne({ phone: phoneNumber })
                    .exec();
                if (order) {
                    await this.ordersModel.findByIdAndUpdate(order.id, {
                        tg_chat: chatId,
                    });
                }
                this.bot.sendMessage(chatId, `Дякую, ${msg.from.first_name} тепер тобі будуть надходити повідомлення про нові пропозиції в твоїй категорії.`);
            }
        });
        this.bot.on('callback_query', async (query) => {
            const { data } = query;
            const [action, phone, chatId] = data.split(':');
            if (action === 'accept') {
                const order = await this.sendAgreement(phone, chatId);
                console.log(order);
                if (order === true) {
                    const msg = `${query.message.text} Ви погодились на це замовлення \n`;
                    this.bot.editMessageText(msg, {
                        chat_id: chatId,
                        message_id: query.message.message_id,
                    });
                }
            }
        });
        this.bot.onText(/\/stop/, async (msg) => {
            const chatId = msg.chat.id;
            const user = await this.userModel.findOne({ tg_chat: chatId }).exec();
            if (user) {
                await this.userModel.findByIdAndUpdate(user.id, { tg_chat: null });
            }
            else {
                const order = await this.ordersModel
                    .findOne({ tg_chat: chatId })
                    .exec();
                if (order) {
                    await this.ordersModel.findByIdAndUpdate(order.id, { tg_chat: null });
                }
            }
            this.bot.sendMessage(chatId, `Ви ввімкнули повідомлення`);
        });
    }
    async sendMessage(chatId, msg) {
        try {
            const message = await this.bot.sendMessage(chatId, msg);
            return message;
        }
        catch (error) {
            throw new Error(`Помилка надсилання повідомлення: ${error}`);
        }
    }
    async sendAgreement(phone, chatId) {
        try {
            const order = await this.ordersModel.findOne({ phone: phone });
            const user = await this.userModel.findOne({ tg_chat: chatId });
            if (order.tg_chat !== null && order.active === true) {
                const msgTrue = `Доброго дня, замовник отримав Вашу відповідь`;
                await this.sendMessage(chatId, msgTrue);
                const msgOrder = `Користувач ${user.firstName} ${user.lastName} готовий виконати ваше замовлення "${order.description}".
      Ви можете написати йому в телеграм @${user.telegram}, або зателефонувати по номеру ${user.phone}.
      Посилання на профіль виконавця ${process.env.FRONT_LINK}${user._id}. ${user.video[0]}`;
                await this.sendMessage(order.tg_chat, msgOrder);
                return true;
            }
            else if (order.tg_chat === null) {
                const msg = `Замовник ще не активував чат-бот, спробуйте пізніше`;
                await this.sendMessage(chatId, msg);
                return false;
            }
            else {
                const msg = `Замовник призупинив пошук`;
                await this.sendMessage(chatId, msg);
                return true;
            }
        }
        catch (e) {
            throw new Error(`Помилка надсилання повідомлення: ${e}`);
        }
    }
    async sendNewOrder(chatId, order) {
        try {
            const msg = `Доброго дня, з'явилось нове повідомлення за Вашим профілем. 
      Замовник: ${order.name}.
      Дата події: ${order.date}.
      Категорія: ${order.category[0].name}.
      Вимоги замовника: ${order.description}.
      Локація: ${order.location}.
      Гонорар: ${order.price}`;
            const keyboard = {
                inline_keyboard: [
                    [
                        {
                            text: 'Згоден',
                            callback_data: `accept:${order.phone}:${chatId}`,
                        },
                        {
                            text: 'Не цікаво',
                            callback_data: 'disagree',
                        },
                    ],
                ],
            };
            const result = await this.bot.sendMessage(chatId, msg, {
                reply_markup: keyboard,
            });
            return result;
        }
        catch (error) {
            throw new Error(`Помилка надсиланння повідомлення: ${error}`);
        }
    }
};
exports.TelegramService = TelegramService;
exports.TelegramService = TelegramService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_model_1.Orders.name)),
    __param(1, (0, mongoose_1.InjectModel)(users_model_1.User.name)),
    __metadata("design:paramtypes", [order_model_1.Orders,
        users_model_1.User])
], TelegramService);
//# sourceMappingURL=telegram.service.js.map