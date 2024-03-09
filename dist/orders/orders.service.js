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
const users_model_1 = require("../users/users.model");
const mesengers_service_1 = require("./mesengers.service");
let OrdersService = class OrdersService {
    constructor(mesengersService, ordersModel, userModel) {
        this.mesengersService = mesengersService;
        this.ordersModel = ordersModel;
        this.userModel = userModel;
    }
    async findAllOrders() {
        try {
            const find = await this.ordersModel.find().exec();
            return find;
        }
        catch (e) {
            throw new http_errors_1.NotFound('Order not found');
        }
    }
    async findOrderById(id) {
        try {
            const find = await this.ordersModel.findById({ _id: id }).exec();
            return find;
        }
        catch (e) {
            throw new http_errors_1.NotFound('Order not found');
        }
    }
    async findOrderByPhone(phone) {
        try {
            const find = await this.ordersModel.findOne({ phone: phone }).exec();
            return find;
        }
        catch (e) {
            throw new http_errors_1.NotFound('Order not found');
        }
    }
    async generateSixDigitNumber() {
        const min = 100000;
        const max = 999999;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    async create(orderObj) {
        try {
            const params = __rest(orderObj, []);
            const verificationCode = await this.generateSixDigitNumber();
            const allOrders = await this.ordersModel.find({ phone: orderObj.phone });
            const allUsers = await this.userModel.find({ phone: orderObj.phone });
            if (Array.isArray(allOrders) &&
                allOrders.length === 0 &&
                Array.isArray(allUsers) &&
                allUsers.length === 0) {
                const createdOrder = await this.ordersModel.create(params);
                await this.ordersModel.findByIdAndUpdate({ _id: createdOrder._id }, { sms: verificationCode });
                return await this.ordersModel.findById({ _id: createdOrder._id });
            }
            else if ((Array.isArray(allOrders) && allOrders.length !== 0) ||
                (Array.isArray(allUsers) && allUsers.length !== 0)) {
                if (allOrders.length !== 0) {
                    const tgChat = allOrders[allOrders.length - 1].tg_chat;
                    const viber = allOrders[allOrders.length - 1].viber_chat;
                    const sms = allOrders[allOrders.length - 1].sms;
                    if (tgChat === null && viber === null && sms !== null) {
                        throw (0, http_errors_1.Conflict)('Ви не активували бот');
                    }
                    if ((tgChat !== null && sms !== null) ||
                        (viber !== null && sms !== null)) {
                        throw (0, http_errors_1.Conflict)('Ви не підтвердили попередній запит');
                    }
                    if (tgChat !== null) {
                        const createdOrder = await this.ordersModel.create(params);
                        createdOrder.tg_chat = tgChat;
                        createdOrder.sms = verificationCode;
                        createdOrder.save();
                        await this.mesengersService.sendCode(tgChat, verificationCode);
                        return await this.ordersModel.findById({ _id: createdOrder._id });
                    }
                    if (viber !== null) {
                        const createdOrder = await this.ordersModel.create(params);
                        createdOrder.viber_chat = viber;
                        createdOrder.sms = verificationCode;
                        createdOrder.save();
                        await this.mesengersService.sendCode(viber, verificationCode);
                        return await this.ordersModel.findById({ _id: createdOrder._id });
                    }
                }
                if (allUsers.length !== 0) {
                    const u_tgChat = allUsers[0].tg_chat;
                    const u_viber = allUsers[0].viber_chat;
                    if (u_tgChat !== null) {
                        const createdOrder = await this.ordersModel.create(params);
                        createdOrder.tg_chat = u_tgChat;
                        createdOrder.sms = verificationCode;
                        createdOrder.save();
                        await this.mesengersService.sendCode(u_tgChat, verificationCode);
                        return await this.ordersModel.findById({ _id: createdOrder._id });
                    }
                    if (u_viber !== null) {
                        const createdOrder = await this.ordersModel.create(params);
                        createdOrder.viber_chat = u_viber;
                        createdOrder.sms = verificationCode;
                        createdOrder.save();
                        await this.mesengersService.sendCode(u_viber, verificationCode);
                        return await this.ordersModel.findById({ _id: createdOrder._id });
                    }
                }
            }
            else {
                throw new http_errors_1.BadRequest('Order not found');
            }
        }
        catch (e) {
            throw e;
        }
    }
    async verifyOrder(code) {
        try {
            const order = await this.ordersModel.findOne({ sms: code });
            if (order === null) {
                throw new http_errors_1.NotFound('Order not found');
            }
            if (order.verify === false) {
                await this.ordersModel.findByIdAndUpdate({ _id: order._id }, { verify: true, sms: null });
                const usersArr = await this.findUserByCategory(order);
                const sendMessagePromises = usersArr.map(async (user) => {
                    if (user.tg_chat !== null) {
                        const check = await this.checkTrialStatus(user._id);
                        if (check === true) {
                            await this.mesengersService.sendNewTgOrder(user.tg_chat, order);
                        }
                    }
                    if (user.viber_chat !== null) {
                        const check = await this.checkTrialStatus(user._id);
                        if (check === true) {
                            await this.mesengersService.sendNewViberOrder(user.viber_chat, order);
                        }
                    }
                });
                await Promise.all(sendMessagePromises);
                if (usersArr.length !== 0) {
                    const message = `Ваше замовлення було успішно опубліковано. Очікуйте відгуків на Вашу пропозицію.`;
                    if (order.tg_chat !== null) {
                        await this.mesengersService.sendMessageTg(order.tg_chat, message);
                    }
                    else if (order.viber_chat !== null) {
                        await this.mesengersService.sendMessageViber(order.viber_chat, message);
                    }
                    return usersArr;
                }
                else {
                    const message = 'На жаль, ніхто не відгукнувся на ваше замовлення. Спробуйте пізніше або використайте пошук самостійно за посиланням: https://www.wechirka.com/artists';
                    if (order.tg_chat !== null) {
                        await this.mesengersService.sendMessageTg(order.tg_chat, message);
                    }
                    else if (order.viber_chat !== null) {
                        await this.mesengersService.sendMessageViber(order.viber_chat, message);
                    }
                    return usersArr;
                }
            }
            else {
                throw new http_errors_1.BadRequest('Order not found');
            }
        }
        catch (e) {
            if (e.message === 'ETELEGRAM: 400 Bad Request: chat not found') {
                return [];
            }
            throw e;
        }
    }
    async checkTrialStatus(id) {
        try {
            const user = await this.userModel.findById(id);
            if (!user) {
                throw new http_errors_1.NotFound('User not found');
            }
            if (user.trialEnds > new Date() || user.paidEnds > new Date()) {
                return true;
            }
            else {
                user.trial = false;
                user.paid = false;
                await user.save();
                return false;
            }
        }
        catch (error) {
            throw error;
        }
    }
    async findUserByCategory(order) {
        try {
            const orderCategories = order.category;
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
            const subcategoriesId = extractIds(orderCategories);
            const findId = subcategoriesId[0];
            const subcategory = await this.userModel
                .find({
                'category.subcategories': {
                    $elemMatch: {
                        id: findId,
                    },
                },
                location: order.location,
            })
                .exec();
            if (Array.isArray(subcategory) && subcategory.length === 0) {
                const [city, municipality, district, region, index, country] = order.location.split(', ');
                if (city === 'Київ') {
                    const regexLocation = new RegExp('Київська область', 'i');
                    const category = await this.userModel
                        .find({
                        'category.subcategories': {
                            $elemMatch: {
                                id: findId,
                            },
                        },
                        location: { $regex: regexLocation },
                    })
                        .exec();
                    return category;
                }
                else {
                    const regexLocation = new RegExp(region, 'i');
                    const category = await this.userModel
                        .find({
                        'category.subcategories': {
                            $elemMatch: {
                                id: findId,
                            },
                        },
                        location: { $regex: regexLocation },
                    })
                        .exec();
                    return category;
                }
            }
            return subcategory;
        }
        catch (error) {
            throw error;
        }
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)(order_model_1.Orders.name)),
    __param(2, (0, mongoose_1.InjectModel)(users_model_1.User.name)),
    __metadata("design:paramtypes", [mesengers_service_1.MesengersService,
        order_model_1.Orders,
        users_model_1.User])
], OrdersService);
//# sourceMappingURL=orders.service.js.map