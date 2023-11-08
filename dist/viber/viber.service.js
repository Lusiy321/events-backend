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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViberService = exports.ViberBot = void 0;
const common_1 = require("@nestjs/common");
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
const ngrok = require('ngrok');
let ViberService = class ViberService {
    constructor() {
        this.bot = new exports.ViberBot({
            authToken: process.env.VIBER_ACCESS_TOKEN,
            name: 'Wechirka',
            avatar: 'https://raw.githubusercontent.com/devrelv/drop/master/151-icon.png',
        });
        this.bot
            .getBotProfile()
            .then((response) => console.log(`Bot Named: ${response.name}`))
            .catch((error) => {
            console.error('Error while getting bot profile:', error);
        });
    }
    handleIncomingMessage(message, response) {
        if (message.text === 'Підписатися') {
            console.log(message.text);
            this.sendSubscriptionPrompt(response);
        }
        else {
            this.sendDefaultResponse(response, message.text);
        }
    }
    sendDefaultResponse(response, text) {
        if (text === 'text') {
        }
        else if (text === 'url') {
        }
        else if (text === 'contact') {
        }
        else {
        }
    }
    sendSubscriptionPrompt(response) {
        response.sendTextMessage('Введите ваш номер телефона для подписки');
    }
    startServer() {
        if (process.env.NOW_URL || process.env.HEROKU_URL) {
            const http = require('http');
            const port = 1869;
            http
                .createServer(this.bot.middleware())
                .listen(port, () => this.bot.setWebhook(process.env.NOW_URL || process.env.HEROKU_URL));
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
                await http
                    .createServer(this.bot.middleware())
                    .listen(port, () => this.bot.setWebhook(publicUrl));
            })
                .catch((error) => {
                console.log('Can not connect to ngrok server. Is it running?');
                console.error(error);
                process.exit(1);
            });
        }
    }
};
exports.ViberService = ViberService;
exports.ViberService = ViberService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ViberService);
//# sourceMappingURL=viber.service.js.map