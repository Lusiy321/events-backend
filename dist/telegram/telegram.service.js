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
const axios_1 = require("@nestjs/axios");
let TelegramService = class TelegramService {
    constructor(ordersModel, userModel, httpService) {
        this.ordersModel = ordersModel;
        this.userModel = userModel;
        this.httpService = httpService;
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
            this.bot.sendMessage(chatId, 'Пожалуйста, нажмите на кнопку "Запросить номер телефона" для предоставления номера телефона.', opts);
        });
        this.bot.on('contact', async (msg) => {
            const chatId = msg.chat.id;
            const phoneNumber = msg.contact.phone_number;
            const user = await this.userModel.findOne({ phone: phoneNumber }).exec();
            if (user) {
                await this.userModel.findByIdAndUpdate(user.id, { tg_chat: chatId });
                return this.bot.sendMessage(chatId, `Спасибо, ${msg.from.first_name} теперь тебе будут приходить уведомления о новых предложенияех в твоей категории.`);
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
                return this.bot.sendMessage(chatId, `Спасибо, ${msg.from.first_name} теперь тебе будут приходить уведомления о новых предложенияех в твоей категории.`);
            }
        });
        this.bot.on('callback_query', async (query) => {
            const { data } = query;
            const [action, phone, chatId] = data.split(':');
            if (action === 'accept') {
                console.log('worck');
                fetch(`${process.env.BACK_LINK}telegram/send/${phone}/${chatId}`, {
                    method: 'GET',
                });
            }
        });
        this.bot.onText(/\/stop/, async (msg) => {
            const chatId = msg.chat.id;
            const user = await this.userModel.findOne({ tg_chat: chatId }).exec();
            if (user) {
                await this.userModel.findByIdAndUpdate(user.id, { tg_chat: null });
                return;
            }
            else {
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
    async sendMessage(chatId, msg) {
        try {
            const message = await this.bot.sendMessage(chatId, msg);
            return message;
        }
        catch (error) {
            throw new Error(`Ошибка отправки сообщения: ${error}`);
        }
    }
    async sendNewOrder(chatId, order) {
        try {
            const msg = `Доброго дня, з'явилось нове повідомлення по Вашому профілю. 
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
                            callback_data: 'not',
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
            throw new Error(`Ошибка отправки сообщения: ${error}`);
        }
    }
};
exports.TelegramService = TelegramService;
exports.TelegramService = TelegramService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_model_1.Orders.name)),
    __param(1, (0, mongoose_1.InjectModel)(users_model_1.User.name)),
    __metadata("design:paramtypes", [order_model_1.Orders,
        users_model_1.User,
        axios_1.HttpService])
], TelegramService);
//# sourceMappingURL=telegram.service.js.map