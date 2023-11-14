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
exports.ViberService = exports.ViberBot = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
exports.ViberBot = require('viber-bot').Bot;
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
const users_model_1 = require("../users/users.model");
const order_model_1 = require("../orders/order.model");
const ngrok = require('ngrok');
let ViberService = class ViberService {
    constructor(userModel, orderModel) {
        this.userModel = userModel;
        this.orderModel = orderModel;
        this.bot = new exports.ViberBot({
            authToken: process.env.VIBER_ACCESS_TOKEN,
            name: 'Wechirka',
            avatar: 'https://raw.githubusercontent.com/devrelv/drop/master/151-icon.png',
        });
        this.bot.onSubscribe(async (response) => {
            say(response, `Привіт ${response.userProfile.name}. Я бот ресурсу ${this.bot.name}! Щоб отримувати сповіщеня, відправте свій номер телефону у форматі 380981231122. Сюди, Вам будуть надходити сповіщеня про найм`);
        });
        const userProfile = {
            id: 'SGznWkU3DQy/H7jnGTnLwA==',
            name: 'Владимир',
            avatar: 'https://media-direct.cdn.viber.com/download_photo?dlid=-NN71zPkZ9zeF8VRrLdFoDfPuw3rjcoiZWKKz_MdqLrReyz1x9OVS9WwNzMNNSF62GuixjWJSTrWc4CoKlhBvy5Bwt2lRvGAvhqToJds84YMhzfetBcxWUZduSg6Ec9wXke9Dg&fltp=jpg&imsz=0000',
            country: 'UA',
            language: 'ru',
            apiVersion: 10,
        };
        function say(response, message) {
            response.send(new TextMessage(message));
        }
        this.bot.onTextMessage(/./, async (msg, res) => {
            try {
                const messageText = msg.text;
                const phoneNumber = parseInt(messageText);
                const order = await this.orderModel.findById('652eae0dee939a130c084e21');
                this.sendNewOrder(res.userProfile.id, order);
                const actionBody = msg.text;
                const [action, phone, chatId] = actionBody.split(':');
                switch (action) {
                    case 'accept':
                        say(res, 'Вы согласились.');
                        break;
                    case 'disagree':
                        say(res, 'Вы не согласились.');
                        break;
                    default:
                        break;
                }
                if (!isNaN(phoneNumber) && phoneNumber.toString().length === 12) {
                    const user = await this.userModel.find({ phone: phoneNumber });
                    if (Array.isArray(user) && user.length === 0) {
                        const order = await this.orderModel.find({ phone: phoneNumber });
                        if (Array.isArray(order) && order.length === 0) {
                            say(res, `${res.userProfile.name}, Ми не знайшли Ваш номер в базі`);
                        }
                        else if (order.vibe === null) {
                            order.viber = res.userProfile.id;
                            say(res, `Дякую, ${res.userProfile.name} теперь тобі будуть надходити сповіщення про нові пропозиції твоїй категорії.`);
                        }
                        else {
                            order.viber = null;
                            say(res, `${res.userProfile.name}, Ви відписалися від сповіщення про нові пропозиції твоїй категорії.`);
                        }
                    }
                    else if (user.vibe === null) {
                        user.viber = res.userProfile.id;
                        say(res, `Дякую, ${res.userProfile.name} теперь тобі будуть надходити сповіщення про нові пропозиції твоїй категорії.`);
                    }
                    else {
                        user.viber = null;
                        say(res, `${res.userProfile.name} відписалися від сповіщення про нові пропозиції твоїй категорії.`);
                    }
                }
                else {
                    say(res, 'Ви ввели не корректний номер телефону. Якщо ви вже підписані на сповіщення, та хочете відписатися, введіть свій номер телефону');
                }
            }
            catch (error) {
                console.error('Error while sending message:', error);
            }
        });
        this.bot
            .getBotProfile()
            .then((response) => console.log(`Bot Named: ${response.name}`))
            .catch((error) => {
            console.error('Error while getting bot profile:', error);
        });
    }
    async sendNewOrder(userId, order) {
        try {
            const msg = `Доброго дня, з'явилось нове повідомлення по Вашому профілю. \nn
      Замовник: ${order.name}.
      Дата події: ${order.date}.
      Категорія: ${order.category[0].name}.
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
                        Text: 'Згоден',
                        TextSize: 'regular',
                        TextVAlign: 'middle',
                        TextHAlign: 'center',
                        BgColor: '#4CAF50',
                    },
                    {
                        ActionType: 'reply',
                        ActionBody: 'disagree',
                        Text: 'Не згоден',
                        TextSize: 'regular',
                        TextVAlign: 'middle',
                        TextHAlign: 'center',
                        BgColor: '#4CAF50',
                    },
                ],
            };
            this.bot.sendMessage({ id: userId }, [
                new TextMessage(msg),
                new RichMediaMessage(KEYBOARD),
            ]);
        }
        catch (error) {
            throw new Error(`Помилка надсиланння повідомлення: ${error}`);
        }
    }
    startServer() {
        if (process.env.NOW_URL || process.env.HEROKU_URL) {
            const http = require('http');
            const port = 1869;
            http.createServer(this.bot.middleware()).listen(port, () => {
                console.log('Server is running!');
                this.bot.setWebhook(process.env.NOW_URL || process.env.HEROKU_URL);
            });
        }
        else {
            return ngrok
                .connect({
                addr: 1869,
            })
                .then(async (publicUrl) => {
                const http = require('http');
                const port = 1869;
                console.log('publicUrl => ', publicUrl);
                http.createServer(this.bot.middleware()).listen(port, () => {
                    console.log('Server is running!');
                    this.bot.setWebhook(publicUrl);
                });
            })
                .catch((error) => {
                console.log('Error occurred while connecting to ngrok.');
                console.error(error);
                process.exit(1);
            });
        }
    }
};
exports.ViberService = ViberService;
exports.ViberService = ViberService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(users_model_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(order_model_1.Orders.name)),
    __metadata("design:paramtypes", [users_model_1.User,
        order_model_1.Orders])
], ViberService);
//# sourceMappingURL=viber.service.js.map