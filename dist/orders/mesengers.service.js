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
exports.MesengersService = exports.ViberBot = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const TelegramBot = require("node-telegram-bot-api");
exports.ViberBot = require('viber-bot').Bot;
const TextMessage = require('viber-bot').Message.Text;
const RichMediaMessage = require('viber-bot').Message.RichMedia;
const KeyboardMessage = require('viber-bot').Message.Keyboard;
const PictureMessage = require('viber-bot').Message.Picture;
const users_model_1 = require("../users/users.model");
const order_model_1 = require("./order.model");
const ngrok = require('ngrok');
const MAIN_KEYBOARD = {
    Type: 'keyboard',
    Revision: 1,
    ButtonsGroupColumns: 3,
    ButtonsGroupRows: 1,
    Buttons: [
        {
            ActionType: 'open-url',
            ActionBody: 'https://www.wechirka.com',
            Text: '<font color="#FFFFFF" size="5">Перейти на наш сайт</font>',
            TextSize: 'regular',
            TextVAlign: 'middle',
            TextHAlign: 'center',
            BgColor: '#094356',
        },
        {
            ActionType: 'reply',
            ActionBody: `orders`,
            Text: '<font color="#FFFFFF" size="5">Мої заявки (лише для замовників)</font>',
            TextSize: 'regular',
            TextVAlign: 'middle',
            TextHAlign: 'center',
            BgColor: '#094356',
        },
    ],
};
let MesengersService = class MesengersService {
    constructor(ordersModel, userModel) {
        this.ordersModel = ordersModel;
        this.userModel = userModel;
        this.viber_bot = new exports.ViberBot({
            authToken: process.env.VIBER_ACCESS_TOKEN,
            name: 'Wechirka',
            avatar: 'https://res.cloudinary.com/dciy3u6un/image/upload/v1701947849/service/paanrsds5krezvpreog0.webp',
        });
        this.viber_bot.onSubscribe(async (response) => {
            say(response, `Привіт ${response.userProfile.name}. Я бот ресурсу ${this.viber_bot.name}! Щоб отримувати сповіщеня, відправте свій номер телефону у форматі 380981231122. Сюди, Вам будуть надходити сповіщеня про найм`);
        });
        function say(response, message) {
            response.send(new KeyboardMessage(MAIN_KEYBOARD), new TextMessage(message));
        }
        this.viber_bot.onTextMessage(/./, async (msg, res) => {
            try {
                const userProfile = res.userProfile.name;
                const userId = res.userProfile.id;
                const MAIN_KEYBOARD = {
                    Type: 'keyboard',
                    Revision: 1,
                    ButtonsGroupColumns: 3,
                    ButtonsGroupRows: 1,
                    Buttons: [
                        {
                            ActionType: 'open-url',
                            ActionBody: 'https://www.wechirka.com',
                            Text: '<font color="#FFFFFF" size="5">Перейти на наш сайт</font>',
                            TextSize: 'large',
                            TextVAlign: 'middle',
                            TextHAlign: 'center',
                            BgColor: '#094356',
                        },
                        {
                            ActionType: 'reply',
                            ActionBody: `orders:${userProfile}:${userId}`,
                            Text: '<font color="#FFFFFF" size="5">Мої заявки (лише для замовників)</font>',
                            TextSize: 'large',
                            TextVAlign: 'middle',
                            TextHAlign: 'center',
                            BgColor: '#094356',
                        },
                    ],
                };
                this.viber_bot.sendMessage({ id: res.userProfile.id }, new KeyboardMessage(MAIN_KEYBOARD));
                const messageText = msg.text;
                const phoneNumber = parseInt(messageText);
                const actionBody = msg.text;
                const [action, phone, chatId] = actionBody.split(':');
                switch (action) {
                    case 'accept':
                        await this.sendViberAgreement(phone, chatId);
                        break;
                    case 'disagree':
                        const user = await this.userModel.findOne({ viber: chatId });
                        user.disagree_order += 1;
                        await this.userModel.findByIdAndUpdate(user.id, {
                            disagree_order: user.disagree_order,
                        });
                        say(res, 'Ви не погодились на пропозицію.');
                        break;
                    case 'orders':
                        await this.myOrdersList(chatId);
                        break;
                    case 'delete':
                        const delOrder = await this.ordersModel.findById(phone);
                        this.viber_bot.sendMessage({ id: chatId }, [
                            new TextMessage(`Ви видалили замевлення: ${delOrder.description}.`),
                            new KeyboardMessage(MAIN_KEYBOARD),
                        ]);
                        await this.ordersModel.findByIdAndRemove(phone);
                        break;
                    case 'active':
                        const actiOrder = await this.ordersModel.findById(phone);
                        await this.ordersModel.findByIdAndUpdate(actiOrder.id, {
                            active: true,
                        });
                        this.viber_bot.sendMessage({ id: chatId }, [
                            new TextMessage(`Ви активували замевлення: ${actiOrder.description}.`),
                            new KeyboardMessage(MAIN_KEYBOARD),
                        ]);
                        break;
                    case 'deactive':
                        const deactiOrder = await this.ordersModel.findById(phone);
                        await this.ordersModel.findByIdAndUpdate(deactiOrder.id, {
                            active: false,
                        });
                        this.viber_bot.sendMessage({ id: chatId }, [
                            new TextMessage(`Ви деактивували замевлення: ${deactiOrder.description}.`),
                            new KeyboardMessage(MAIN_KEYBOARD),
                        ]);
                        break;
                    case 'users':
                        const findOrder = await this.ordersModel.findOne({ _id: phone });
                        findOrder.accepted_users.map(async (user) => {
                            const findedUser = await this.userModel.findOne({ _id: user });
                            const msgOrder = `Замовлення:\n${findOrder.description}\nКористувач: ${findedUser.firstName}.\nКатегорія: ${findedUser.category[0].subcategories[0].name}\nОплата: ${findedUser.price}\nТелефон: +${findedUser.phone}.\nПосилання на профіль:\n${process.env.FRONT_LINK}artists/${findedUser._id}.`;
                            this.viber_bot.sendMessage({ id: chatId }, [
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
                    if ((user && user.viber === null) ||
                        (order && order.viber === null)) {
                        const updatedUser = await this.userModel.findByIdAndUpdate({ _id: user.id }, {
                            viber: res.userProfile.id,
                        });
                        const updatedOrder = await this.ordersModel.findByIdAndUpdate({ _id: order.id }, {
                            viber: res.userProfile.id,
                        });
                        await updatedUser.save();
                        await updatedOrder.save();
                        this.viber_bot.sendMessage({ id: res.userProfile.id }, [
                            new TextMessage(`Дякую, ${res.userProfile.name} теперь Вам будуть надходити сповіщення про нові пропозиції у обраній категорії категорії.`),
                            new KeyboardMessage(MAIN_KEYBOARD),
                        ]);
                        return updatedUser || updatedOrder;
                    }
                    else if ((user && user.viber === res.userProfile.id) ||
                        (order && order.viber === res.userProfile.id)) {
                        const updatedUser = await this.userModel.findByIdAndUpdate({ _id: user.id }, {
                            viber: null,
                        });
                        const updatedOrder = await this.ordersModel.findByIdAndUpdate({ _id: order.id }, {
                            viber: null,
                        });
                        await updatedUser.save();
                        await updatedOrder.save();
                        this.viber_bot.sendMessage({ id: res.userProfile.id }, [
                            new TextMessage(`${res.userProfile.name} Ви відписалися від сповіщення про нові пропозиції.`),
                            new KeyboardMessage(MAIN_KEYBOARD),
                        ]);
                        return updatedUser || updatedOrder;
                    }
                    else {
                        this.viber_bot.sendMessage({ id: res.userProfile.id }, [
                            new TextMessage(`Користувач з номером ${phoneNumber} не зареєстрований у нашій системі.`),
                            new KeyboardMessage(MAIN_KEYBOARD),
                        ]);
                    }
                }
            }
            catch (error) {
                console.error('Error while sending message:', error);
            }
        });
        this.viber_bot
            .getBotProfile()
            .then((response) => console.log(`Bot Named: ${response.name}`))
            .catch((error) => {
            console.error('Error while getting bot profile:', error);
        });
        const token = process.env.BOT_TELEGRAM;
        this.tg_bot = new TelegramBot(token, { polling: true });
        this.tg_bot.setMyCommands([
            { command: '/stop', description: 'Зупинити оповіщення' },
            { command: '/orders', description: 'Управління замовленнями' },
        ]);
        const optURL = {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'Перейти на сайт',
                            url: 'https://www.wechirka.com/',
                        },
                    ],
                ],
                resize_keyboard: true,
            },
        };
        const optCont = {
            reply_markup: {
                keyboard: [
                    [
                        {
                            text: 'Відправити номер телефону',
                            request_contact: true,
                        },
                    ],
                ],
                resize_keyboard: true,
            },
        };
        this.tg_bot.onText(/\/start/, async (msg) => {
            const chatId = msg.chat.id;
            this.tg_bot.sendMessage(chatId, 'Будь ласка, натисніть кнопку "Відправити номер телефону" для надання номеру телефону.', optCont);
        });
        this.tg_bot.onText(/\/orders/, async (msg) => {
            try {
                const chatId = msg.chat.id;
                const user = await this.userModel.findOne({ tg_chat: chatId }).exec();
                const find = await this.ordersModel.find({ tg_chat: chatId }).exec();
                if (user.tg_chat && Array.isArray(find) && find.length === 0) {
                    this.tg_bot.sendMessage(chatId, 'Ви не зареєстровані як замовник', optCont);
                }
                else {
                    if (Array.isArray(find) && find.length === 0) {
                        this.tg_bot.sendMessage(chatId, 'Ми не знайшли Ваших заявок, напевно ви не зареєструвались у чат боті (натисніть /start)', optCont);
                    }
                    else if (find || user.tg_chat === find[0].tg_chat) {
                        find.map((finded) => {
                            const msg = `Замовник: ${finded.name}.
      Дата події: ${finded.date}.
      Категорія: ${finded.category[0].subcategories[0].name}.
      Вимоги замовника: ${finded.description}.
      Локація: ${finded.location}.
      Гонорар: ${finded.price}.
      Кількість відгуків: ${finded.approve_count}.`;
                            if (finded.active === true) {
                                const keyboard = {
                                    inline_keyboard: [
                                        [
                                            {
                                                text: 'Видалити',
                                                callback_data: `delete:${finded._id}:${chatId}`,
                                            },
                                            {
                                                text: 'Деактивувати',
                                                callback_data: `deactive:${finded._id}:${chatId}`,
                                            },
                                        ],
                                        [
                                            {
                                                text: 'Відгуки на пропозицію',
                                                callback_data: `users:${finded._id}:${chatId}`,
                                            },
                                        ],
                                    ],
                                };
                                this.tg_bot.sendMessage(chatId, msg, {
                                    reply_markup: keyboard,
                                });
                            }
                            else {
                                const keyboard = {
                                    inline_keyboard: [
                                        [
                                            {
                                                text: 'Видалити',
                                                callback_data: `delete:${finded._id}:${chatId}`,
                                            },
                                            {
                                                text: 'Активувати',
                                                callback_data: `active:${finded._id}:${chatId}`,
                                            },
                                        ],
                                        [
                                            {
                                                text: 'Відгуки на пропозицію',
                                                callback_data: `users:${finded._id}:${chatId}`,
                                            },
                                        ],
                                    ],
                                };
                                this.tg_bot.sendMessage(chatId, msg, {
                                    reply_markup: keyboard,
                                });
                            }
                        });
                    }
                }
            }
            catch (e) {
                throw new Error(`Помилка надсилання повідомлення: ${e}`);
            }
        });
        this.tg_bot.on('contact', async (msg) => {
            const chatId = msg.chat.id;
            const phoneNumber = msg.contact.phone_number;
            const user = await this.userModel.findOne({ phone: phoneNumber }).exec();
            const order = await this.ordersModel
                .findOne({ phone: phoneNumber })
                .exec();
            if (user.tg_chat === null) {
                await this.userModel.findByIdAndUpdate(user.id, {
                    tg_chat: chatId,
                    verify: true,
                });
                this.tg_bot.sendMessage(chatId, `Дякую, ${msg.from.first_name} тепер Вам будуть надходити повідомлення про нові пропозиції в твоїй категорії. Щоб вимкнути оповіщення виберіть "Меню" та натисніть /stop`, optURL);
            }
            else {
                if (order.tg_chat === null) {
                    await this.ordersModel.findByIdAndUpdate(order.id, {
                        tg_chat: chatId,
                    });
                }
                this.tg_bot.sendMessage(chatId, `Дякую, ${msg.from.first_name} тепер Вам будуть надходити повідомлення про нові пропозиції в твоїй категорії. Щоб вимкнути оповіщення виберіть "Меню" та натисніть /stop`, optURL);
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
                            this.tg_bot.editMessageText(msg, {
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
                        this.tg_bot.sendMessage(chatId, `Ви відмовились від виконання замовлення: ${orders.description}.`, optURL);
                        break;
                    case 'delete':
                        const delOrder = await this.ordersModel.findById(phone);
                        this.tg_bot.sendMessage(chatId, `Ви видалили замевлення: ${delOrder.description}.`, optURL);
                        await this.ordersModel.findByIdAndRemove(phone);
                        break;
                    case 'active':
                        const actiOrder = await this.ordersModel.findById(phone);
                        await this.ordersModel.findByIdAndUpdate(actiOrder.id, {
                            active: true,
                        });
                        this.tg_bot.sendMessage(chatId, `Ви активували замевлення: ${actiOrder.description}.`, optURL);
                        break;
                    case 'deactive':
                        const deactiOrder = await this.ordersModel.findById(phone);
                        await this.ordersModel.findByIdAndUpdate(deactiOrder.id, {
                            active: false,
                        });
                        this.tg_bot.sendMessage(chatId, `Ви деактивували замевлення: ${deactiOrder.description}.`, optURL);
                        break;
                    case 'users':
                        const findOrder = await this.ordersModel.findOne({ _id: phone });
                        findOrder.accepted_users.map(async (user) => {
                            const findedUser = await this.userModel.findOne({ _id: user });
                            const msgOrder = `Замовлення:\n${findOrder.description}\nКористувач: ${findedUser.firstName}.\nКатегорія: ${findedUser.category[0].subcategories[0].name}\nОплата: ${findedUser.price}\nТелефон: +${findedUser.phone}.\nПосилання на профіль:\n${process.env.FRONT_LINK}artists/${findedUser._id}.`;
                            this.tg_bot.sendMessage(chatId, msgOrder);
                        });
                        break;
                    default:
                        break;
                }
            }
            catch (e) {
                console.log(e);
            }
        });
        this.tg_bot.onText(/\/stop/, async (msg) => {
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
            this.tg_bot.sendMessage(chatId, `Ви вимкнули оповіщення. Щоб знову отримувати оповіщення, натисніть кнопку "Відправити номер телефону".`, optCont);
        });
    }
    async sendNewViberOrder(userId, order) {
        try {
            const msg = `Доброго дня, з'явилось нове повідомлення по Вашому профілю. \n
      Замовник: ${order.name}.
      Дата події: ${order.date}.
      Категорія: ${order.category[0].subcategories[0].name}.
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
                        Text: '<font color="#FFFFFF" size="5">Згоден</font>',
                        TextSize: 'regular',
                        TextVAlign: 'middle',
                        TextHAlign: 'center',
                        BgColor: '#094356',
                    },
                    {
                        ActionType: 'reply',
                        ActionBody: `disagree:${order.phone}:${userId}`,
                        Text: '<font color="#FFFFFF" size="5">Не згоден</font>',
                        TextSize: 'regular',
                        TextVAlign: 'middle',
                        TextHAlign: 'center',
                        BgColor: '#094356',
                    },
                ],
            };
            this.viber_bot.sendMessage({ id: userId }, [
                new TextMessage(msg),
                new RichMediaMessage(KEYBOARD),
            ]);
        }
        catch (error) {
            throw new Error(`Помилка надсиланння повідомлення: ${error}`);
        }
    }
    async sendViberAgreement(orderPhone, userChatId) {
        try {
            const order = await this.ordersModel.findOne({
                phone: orderPhone,
            });
            const user = await this.userModel.findOne({ viber: userChatId });
            const { viber, active, description, tg_chat } = order;
            const { firstName, phone, _id } = user;
            if (viber !== null && active === true) {
                const msgTrue = `Доброго дня, замовник отримав Вашу відповідь на замовлення:\n"${order.description}".\n \nВ категорії:\n"${order.category[0].name} - ${order.category[0].subcategories[0].name}". \n \nОчікуйте на дзвінок або повідомлення`;
                user.agree_order += 1;
                await this.userModel.findByIdAndUpdate(user.id, {
                    agree_order: user.agree_order,
                });
                this.viber_bot.sendMessage({ id: userChatId }, [
                    new TextMessage(msgTrue),
                    new KeyboardMessage(MAIN_KEYBOARD),
                ]);
                const msgOrder = `Користувач ${firstName} готовий виконати ваше замовлення "${description}". \n Посилання на профіль виконавця: ${process.env.FRONT_LINK}artists/${_id}.\n Ви можете написати йому у Viber, або зателефонувати по номеру. \n` +
                    `\n Телефон: +${phone}`;
                await this.viber_bot.sendMessage({ id: viber }, [
                    new PictureMessage(user.master_photo.url),
                    new TextMessage(msgOrder),
                    new KeyboardMessage(MAIN_KEYBOARD),
                ]);
                return true;
            }
            else if (tg_chat !== null && order.active === true) {
                const msgOrder = `Користувач ${user.firstName} готовий виконати ваше замовлення "${order.description}".
      Ви можете написати йому в Viber, або зателефонувати по номеру +${user.phone}. \n
      Посилання на профіль виконавця ${process.env.FRONT_LINK}artists/${user._id}.`;
                await this.sendMessage(order.tg_chat.toString(), msgOrder);
                if (user.photo.length > 0) {
                    const images = user.photo.map((photos) => ({
                        type: 'photo',
                        media: photos.url,
                    }));
                    await this.tg_bot.sendMediaGroup(order.tg_chat.toString(), images);
                }
                if (user.video.length > 0) {
                    const videos = user.video.map((video) => ({
                        type: 'video',
                        media: video.url,
                    }));
                    await this.tg_bot.sendMediaGroup(order.tg_chat.toString(), videos);
                }
                const msgTrue = `Доброго дня, замовник отримав Вашу відповідь на замовлення:\n"${order.description}".\n \nВ категорії:\n"${order.category[0].name} - ${order.category[0].subcategories[0].name}". \n \nОчікуйте на дзвінок або повідомлення`;
                this.viber_bot.sendMessage({ id: userChatId }, [
                    new TextMessage(msgTrue),
                    new KeyboardMessage(MAIN_KEYBOARD),
                ]);
            }
            else if (viber === null && tg_chat === null) {
                const msg = `Замовник ще не активував чат-бот, спробуйте пізніше`;
                this.viber_bot.sendMessage(userChatId, msg);
                return false;
            }
            else {
                const msg = `Замовник призупинив пошук`;
                this.viber_bot.sendMessage(userChatId, msg);
                return true;
            }
        }
        catch (e) {
            throw new Error(`Помилка надсилання повідомлення: ${e}`);
        }
    }
    async myOrdersList(chatId) {
        try {
            const user = await this.userModel.findOne({ viber: chatId }).exec();
            const find = await this.ordersModel.find({ viber: chatId }).exec();
            if ((user.viber !== null && Array.isArray(find) && find.length === 0) ||
                find[0].viber !== user.viber) {
                this.viber_bot.sendMessage({ id: chatId }, new TextMessage('Ви не являетесь замовником або не зареєструвались у чат-боті. Якщо Ви замовник будь ласка, відправте свій номер телефону у форматі 380981231122'));
            }
            else if (!user || (Array.isArray(find) && find.length === 0)) {
                this.viber_bot.sendMessage({ id: chatId }, new TextMessage('Ми не знайшли Ваших заявок, напевно ви не зарееструвались у чат боті. Будь ласка, відправте свій номер телефону у форматі 380981231122'));
            }
            else {
                find.map((finded) => {
                    const FIND_KEYBOARD = {
                        Type: 'keyboard',
                        Revision: 1,
                        ButtonsGroupColumns: 3,
                        ButtonsGroupRows: 1,
                        Buttons: [
                            {
                                ActionType: 'open-url',
                                ActionBody: 'https://www.wechirka.com',
                                Text: '<font color="#FFFFFF" size="5">Перейти на наш сайт</font>',
                                TextSize: 'regular',
                                TextVAlign: 'middle',
                                TextHAlign: 'center',
                                BgColor: '#094356',
                            },
                            {
                                ActionType: 'reply',
                                ActionBody: `orders:${finded.name}:${finded.viber}`,
                                Text: '<font color="#FFFFFF" size="5">Мої заявки (лише для замовників)</font>',
                                TextSize: 'regular',
                                TextVAlign: 'middle',
                                TextHAlign: 'center',
                                BgColor: '#094356',
                            },
                        ],
                    };
                    const msg = `Замовник: ${finded.name}.
      Дата події: ${finded.date}.
      Категорія: ${finded.category[0].subcategories[0].name}.
      Вимоги замовника: ${finded.description}.
      Локація: ${finded.location}.
      Гонорар: ${finded.price}.
      Кількість відгуків: ${finded.approve_count}.`;
                    if (finded.active === true) {
                        const KEYBOARD = {
                            Type: 'keyboard',
                            Revision: 1,
                            ButtonsGroupColumns: 3,
                            ButtonsGroupRows: 1,
                            Buttons: [
                                {
                                    ActionType: 'reply',
                                    ActionBody: `delete:${finded._id}:${finded.viber}`,
                                    Text: '<font color="#FFFFFF" size="5">Видалити</font>',
                                    TextSize: 'regular',
                                    TextVAlign: 'middle',
                                    TextHAlign: 'center',
                                    BgColor: '#094356',
                                },
                                {
                                    ActionType: 'reply',
                                    ActionBody: `deactive:${finded._id}:${finded.viber}`,
                                    Text: '<font color="#FFFFFF" size="5">Деактивувати</font>',
                                    TextSize: 'regular',
                                    TextVAlign: 'middle',
                                    TextHAlign: 'center',
                                    BgColor: '#094356',
                                },
                            ],
                        };
                        const USERS = {
                            Type: 'keyboard',
                            Revision: 1,
                            ButtonsGroupColumns: 6,
                            ButtonsGroupRows: 1,
                            Buttons: [
                                {
                                    ActionType: 'reply',
                                    ActionBody: `users:${finded._id}:${finded.viber}`,
                                    Text: '<font color="#FFFFFF" size="5">Відгуки на пропозицію</font>',
                                    TextSize: 'regular',
                                    TextVAlign: 'middle',
                                    TextHAlign: 'center',
                                    BgColor: '#094356',
                                },
                            ],
                        };
                        this.viber_bot.sendMessage({ id: chatId }, [
                            new TextMessage(msg),
                            new RichMediaMessage(KEYBOARD, USERS),
                            new RichMediaMessage(USERS),
                            new KeyboardMessage(FIND_KEYBOARD),
                        ]);
                    }
                    else {
                        const KEYBOARD = {
                            Type: 'keyboard',
                            Revision: 1,
                            ButtonsGroupColumns: 3,
                            ButtonsGroupRows: 1,
                            Buttons: [
                                {
                                    ActionType: 'reply',
                                    ActionBody: `delete:${finded._id}:${finded.viber}`,
                                    Text: '<font color="#FFFFFF" size="5">Видалити</font>',
                                    TextSize: 'regular',
                                    TextVAlign: 'middle',
                                    TextHAlign: 'center',
                                    BgColor: '#094356',
                                },
                                {
                                    ActionType: 'reply',
                                    ActionBody: `active:${finded._id}:${finded.viber}`,
                                    Text: '<font color="#FFFFFF" size="5">Активувати</font>',
                                    TextSize: 'regular',
                                    TextVAlign: 'middle',
                                    TextHAlign: 'center',
                                    BgColor: '#094356',
                                },
                            ],
                        };
                        const USERS = {
                            Type: 'keyboard',
                            Revision: 1,
                            ButtonsGroupColumns: 6,
                            ButtonsGroupRows: 1,
                            Buttons: [
                                {
                                    ActionType: 'reply',
                                    ActionBody: `users:${finded._id}:${finded.viber}`,
                                    Text: '<font color="#FFFFFF" size="5">Відгуки на пропозицію</font>',
                                    TextSize: 'regular',
                                    TextVAlign: 'middle',
                                    TextHAlign: 'center',
                                    BgColor: '#094356',
                                },
                            ],
                        };
                        this.viber_bot.sendMessage({ id: chatId }, [
                            new TextMessage(msg),
                            new RichMediaMessage(KEYBOARD),
                            new RichMediaMessage(USERS),
                            new KeyboardMessage(FIND_KEYBOARD),
                        ]);
                    }
                });
            }
        }
        catch (e) {
            throw new Error(`Помилка надсилання повідомлення: ${e}`);
        }
    }
    async sendMessagesToAllViberUsers(msg) {
        const allOrders = await this.ordersModel.find({}).select('viber').exec();
        const allUsers = await this.userModel.find({}).select('viber').exec();
        const allViberUsers = allOrders.concat(allUsers);
        allViberUsers.map((user) => {
            if (user.viber !== null) {
                this.viber_bot.sendMessage({ id: user.viber }, [
                    new TextMessage(msg),
                    new KeyboardMessage(MAIN_KEYBOARD),
                ]);
            }
        });
    }
    async startServer() {
        if (process.env.NOW_URL || process.env.HEROKU_URL) {
            try {
                const http = require('http');
                const port = 8080;
                http
                    .createServer(this.viber_bot.middleware())
                    .listen(port, () => this.viber_bot.setWebhook(process.env.NOW_URL || process.env.HEROKU_URL));
            }
            catch (e) {
                console.log(e);
            }
        }
        else {
            return ngrok
                .connect({
                addr: 3000,
            })
                .then(async (publicUrl) => {
                const http = require('http');
                const port = process.env.PORT || 5000;
                console.log('publicUrl => ', publicUrl);
                http
                    .createServer(this.viber_bot.middleware())
                    .listen(port, () => this.viber_bot.setWebhook(publicUrl));
            })
                .catch((error) => {
                console.log('Can not connect to ngrok server. Is it running?');
                console.error(error);
                process.exit(1);
            });
        }
    }
    async sendMessage(chatId, msg) {
        try {
            const message = await this.tg_bot.sendMessage(chatId, msg);
            return message;
        }
        catch (error) {
            throw new Error(`Помилка надсилання повідомлення: ${error}`);
        }
    }
    async sendMessagesToAllTgUsers(msg) {
        const allOrders = await this.ordersModel.find({}).select('tg_chat').exec();
        const allUsers = await this.userModel.find({}).select('tg_chat').exec();
        const allTgUsers = allOrders.concat(allUsers);
        allTgUsers.map((user) => {
            if (user.tg_chat !== null) {
                this.sendMessage(user.tg_chat.toString(), msg);
            }
        });
    }
    async sendTgAgreement(phone, chatId) {
        try {
            const order = await this.ordersModel.findOne({ phone: phone });
            const user = await this.userModel.findOne({ tg_chat: chatId });
            if (order.tg_chat !== null && order.active === true) {
                const msgTrue = `Доброго дня, замовник отримав Вашу відповідь на замовлення:\n"${order.description}".\n \nВ категорії:\n"${order.category[0].name} - ${order.category[0].subcategories[0].name}". \n \nОчікуйте на дзвінок або повідомлення`;
                await this.sendMessage(chatId, msgTrue);
                order.approve_count += 1;
                user.agree_order += 1;
                await this.userModel.findByIdAndUpdate(user.id, {
                    agree_order: user.agree_order,
                    accepted_orders: order.id,
                });
                await this.ordersModel.findByIdAndUpdate(order.id, {
                    approve_count: order.approve_count,
                    accepted_users: user.id,
                });
                const msgOrder = `Виконавець ${user.firstName} готовий виконати ваше замовлення "${order.description}".
      Ви можете написати йому в телеграм @${user.telegram}, або зателефонувати по номеру ${user.phone}. \n
      Посилання на профіль виконавця ${process.env.FRONT_LINK}artists/${user._id}.`;
                await this.sendMessage(order.tg_chat.toString(), msgOrder);
                if (user.photo.length > 0) {
                    const images = user.photo.map((photos) => ({
                        type: 'photo',
                        media: photos.url,
                    }));
                    await this.tg_bot.sendMediaGroup(order.tg_chat.toString(), images);
                }
                if (user.video.length > 0) {
                    const videos = user.video.map((video) => ({
                        type: 'video',
                        media: video.url,
                    }));
                    await this.tg_bot.sendMediaGroup(order.tg_chat.toString(), videos);
                }
                return true;
            }
            else if (order.viber !== null && order.active === true) {
                const msgOrder = `Користувач ${user.firstName} готовий виконати ваше замовлення "${order.description}". \n Посилання на профіль виконавця: ${process.env.FRONT_LINK}artists/${user._id}.\n Ви можете написати йому у Viber, або зателефонувати по номеру. \n` +
                    `\n Телефон: +${phone}`;
                await this.viber_bot.sendMessage({ id: order.viber }, [
                    new PictureMessage(user.master_photo.url),
                    new TextMessage(msgOrder),
                    new KeyboardMessage(MAIN_KEYBOARD),
                ]);
                const msgTrue = `Доброго дня, замовник отримав Вашу відповідь на замовлення:\n"${order.description}".\n \nВ категорії:\n"${order.category[0].name} - ${order.category[0].subcategories[0].name}". \n \nОчікуйте на дзвінок або повідомлення`;
                await this.sendMessage(chatId, msgTrue);
                order.approve_count = +1;
                await this.ordersModel.findByIdAndUpdate(order.id, {
                    approve_count: order.approve_count,
                });
                return true;
            }
            else if (order.tg_chat === null && order.viber === null) {
                const msg = `Замовник ще не активував чат-бот, спробуйте пізніше`;
                await this.sendMessage(chatId, msg);
                return false;
            }
            else if (order.active === false) {
                const msg = `Замовник призупинив пошук`;
                await this.sendMessage(chatId, msg);
                return true;
            }
        }
        catch (e) {
            throw new Error(`Помилка надсилання повідомлення: ${e}`);
        }
    }
    async sendNewTgOrder(chatId, order) {
        try {
            const msg = `Доброго дня, з'явилось нове повідомлення за Вашим профілем. 
      Замовник: ${order.name}.
      Дата події: ${order.date}.
      Категорія: ${order.category[0].subcategories[0].name}.
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
                            callback_data: `disagree:${order.id}:${chatId}`,
                        },
                    ],
                    [
                        {
                            text: 'Перейти на сайт',
                            url: 'https://www.wechirka.com/',
                        },
                    ],
                ],
            };
            const result = await this.tg_bot.sendMessage(chatId, msg, {
                reply_markup: keyboard,
            });
            return result;
        }
        catch (error) {
            throw new Error(`Помилка надсиланння повідомлення: ${error}`);
        }
    }
    async findMyOrders(chatId) { }
};
exports.MesengersService = MesengersService;
exports.MesengersService = MesengersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_model_1.Orders.name)),
    __param(1, (0, mongoose_1.InjectModel)(users_model_1.User.name)),
    __metadata("design:paramtypes", [order_model_1.Orders,
        users_model_1.User])
], MesengersService);
//# sourceMappingURL=mesengers.service.js.map