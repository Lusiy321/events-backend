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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const order_model_1 = require("./order.model");
const mongoose_1 = require("@nestjs/mongoose");
const http_errors_1 = require("http-errors");
const twilio_service_1 = require("./twilio.service");
const telegram_service_1 = require("../telegram/telegram.service");
const users_model_1 = require("../users/users.model");
let OrdersService = class OrdersService {
    constructor(twilioService, telegramService, ordersModel, userModel) {
        this.twilioService = twilioService;
        this.telegramService = telegramService;
        this.ordersModel = ordersModel;
        this.userModel = userModel;
    }
    async findAllOrders() {
        try {
            const find = await this.ordersModel.find().exec();
            return find;
        }
        catch (e) {
            throw new http_errors_1.NotFound('User not found');
        }
    }
    async findOrderByPhone(phone) {
        try {
            const find = await this.ordersModel.findOne({ phone: phone }).exec();
            return find;
        }
        catch (e) {
            throw new http_errors_1.NotFound('User not found');
        }
    }
    async generateSixDigitNumber() {
        const min = 100000;
        const max = 999999;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    async create(order) {
        try {
            const params = __rest(order, []);
            const existingOrder = await this.ordersModel.findOne({
                phone: order.phone,
                active: true,
            });
            if (existingOrder) {
                throw new http_errors_1.Conflict(`Пользователь с номером телефона ${order.phone} уже существует`);
            }
            else {
                const verificationCode = await this.generateSixDigitNumber();
                const createdOrder = await this.ordersModel.create(params);
                await this.ordersModel.findByIdAndUpdate({ _id: createdOrder._id }, { sms: verificationCode });
                const order = await this.ordersModel.findById(createdOrder._id);
                const usersArr = await this.findUserByCategory(order);
                for (const user of usersArr) {
                    if (user.tg_chat !== null) {
                        await this.telegramService.sendNewOrder(user.tg_chat, order);
                    }
                }
                return await this.ordersModel.findById(createdOrder._id);
            }
        }
        catch (e) {
            throw new http_errors_1.BadRequest(e.message);
        }
    }
    async verifyOrder(code) {
        try {
            const user = await this.ordersModel.findOne({ sms: code });
            if (user) {
                user.verify = true;
                user.save();
                return await this.ordersModel.findOne({ id: user.id });
            }
        }
        catch (e) {
            throw new http_errors_1.BadRequest(e.message);
        }
    }
    async findUserByCategory(order) {
        const arr = order.category;
        function extractIds(data) {
            const ids = [];
            function recursiveExtract(obj) {
                for (const key in obj) {
                    if (key === 'id') {
                        ids.push(obj[key]);
                    }
                    else if (typeof obj[key] === 'object') {
                        recursiveExtract(obj[key]);
                    }
                }
            }
            recursiveExtract(data);
            return ids;
        }
        const subcategoriesId = extractIds(arr);
        const findId = subcategoriesId[0];
        const subcategory = await this.userModel
            .find({
            'category.subcategories': {
                $elemMatch: {
                    id: findId,
                },
            },
        })
            .exec();
        return subcategory;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, mongoose_1.InjectModel)(order_model_1.Orders.name)),
    __param(3, (0, mongoose_1.InjectModel)(users_model_1.User.name)),
    __metadata("design:paramtypes", [twilio_service_1.TwilioService,
        telegram_service_1.TelegramService,
        order_model_1.Orders,
        users_model_1.User])
], OrdersService);
//# sourceMappingURL=orders.service.js.map