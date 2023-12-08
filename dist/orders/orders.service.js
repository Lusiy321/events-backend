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
const users_model_1 = require("../users/users.model");
const mesengers_service_1 = require("./mesengers.service");
let OrdersService = class OrdersService {
    constructor(twilioService, mesengersService, ordersModel, userModel) {
        this.twilioService = twilioService;
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
            const createdOrder = await this.ordersModel.create(params);
            await this.ordersModel.findByIdAndUpdate({ _id: createdOrder._id }, { sms: verificationCode });
            const order = await this.ordersModel.findById(createdOrder._id);
            return order;
        }
        catch (e) {
            throw new http_errors_1.BadRequest(e.message);
        }
    }
    async verifyOrder(code) {
        try {
            const order = await this.ordersModel.findOne({ sms: code });
            if (order) {
                order.verify = true;
                const updatedOrder = await this.ordersModel.findByIdAndUpdate({ _id: order._id }, { verify: true });
                const usersArr = await this.findUserByCategory(order);
                for (const user of usersArr) {
                    if (user.tg_chat !== null && user.location === order.location) {
                        const check = await this.checkTrialStatus(user._id);
                        if (check === true || user.paid === true) {
                            await this.mesengersService.sendNewTgOrder(user.tg_chat, order);
                        }
                    }
                }
                for (const user of usersArr) {
                    if (user.viber !== null && user.location === order.location) {
                        const check = await this.checkTrialStatus(user._id);
                        if (check === true || user.paid === true) {
                            await this.mesengersService.sendNewViberOrder(user.viber, order);
                        }
                    }
                }
                return updatedOrder;
            }
        }
        catch (e) {
            throw new http_errors_1.BadRequest(e.message);
        }
    }
    async checkTrialStatus(id) {
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new http_errors_1.NotFound('User not found');
        }
        if (user.trial && user.trialEnds > new Date()) {
            return true;
        }
        else {
            user.trial = false;
            await user.save();
            return false;
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
        mesengers_service_1.MesengersService,
        order_model_1.Orders,
        users_model_1.User])
], OrdersService);
//# sourceMappingURL=orders.service.js.map