"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersModule = void 0;
const common_1 = require("@nestjs/common");
const orders_controller_1 = require("./orders.controller");
const orders_service_1 = require("./orders.service");
const mongoose_1 = require("@nestjs/mongoose");
const order_model_1 = require("./order.model");
const users_model_1 = require("../users/users.model");
const mesengers_service_1 = require("./mesengers.service");
const order_archive_model_1 = require("./order.archive.model");
const search_service_1 = require("../users/search.service");
let OrdersModule = class OrdersModule {
};
exports.OrdersModule = OrdersModule;
exports.OrdersModule = OrdersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: order_model_1.Orders.name, schema: order_model_1.OrderSchema, collection: 'orders' },
                { name: users_model_1.User.name, schema: users_model_1.UserSchema, collection: 'users' },
                {
                    name: order_archive_model_1.OrdersArchive.name,
                    schema: order_archive_model_1.OrdersArchiveSchema,
                    collection: 'orders-archive',
                },
            ]),
        ],
        controllers: [orders_controller_1.OrdersController],
        providers: [orders_service_1.OrdersService, mesengers_service_1.MesengersService, search_service_1.SearchService],
    })
], OrdersModule);
//# sourceMappingURL=orders.module.js.map