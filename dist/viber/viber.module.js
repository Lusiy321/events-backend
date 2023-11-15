"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViberModule = void 0;
const common_1 = require("@nestjs/common");
const viber_service_1 = require("./viber.service");
const mongoose_1 = require("@nestjs/mongoose");
const order_model_1 = require("../orders/order.model");
const users_model_1 = require("../users/users.model");
const telegram_module_1 = require("../telegram/telegram.module");
let ViberModule = class ViberModule {
};
exports.ViberModule = ViberModule;
exports.ViberModule = ViberModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: order_model_1.Orders.name, schema: order_model_1.OrderSchema, collection: 'orders' },
            ]),
            mongoose_1.MongooseModule.forFeature([
                { name: users_model_1.User.name, schema: users_model_1.UserSchema, collection: 'users' },
            ]),
            telegram_module_1.TelegramModule,
        ],
        providers: [viber_service_1.ViberService],
        exports: [viber_service_1.ViberService],
    })
], ViberModule);
//# sourceMappingURL=viber.module.js.map