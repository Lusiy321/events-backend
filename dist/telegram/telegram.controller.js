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
exports.TelegramController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const telegram_service_1 = require("./telegram.service");
const mongoose_1 = require("@nestjs/mongoose");
const order_model_1 = require("../orders/order.model");
const users_model_1 = require("../users/users.model");
let TelegramController = class TelegramController {
    constructor(telegramService, ordersModel, userModel) {
        this.telegramService = telegramService;
        this.ordersModel = ordersModel;
        this.userModel = userModel;
    }
};
exports.TelegramController = TelegramController;
exports.TelegramController = TelegramController = __decorate([
    (0, swagger_1.ApiTags)('Telegram'),
    (0, common_1.Controller)('telegram'),
    __param(1, (0, mongoose_1.InjectModel)(order_model_1.Orders.name)),
    __param(2, (0, mongoose_1.InjectModel)(users_model_1.User.name)),
    __metadata("design:paramtypes", [telegram_service_1.TelegramService,
        order_model_1.Orders,
        users_model_1.User])
], TelegramController);
//# sourceMappingURL=telegram.controller.js.map