"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const admin_model_1 = require("./admin.model");
const admin_controller_1 = require("./admin.controller");
const admin_service_1 = require("./admin.service");
const jwt_1 = require("@nestjs/jwt");
const users_model_1 = require("../users/users.model");
const order_model_1 = require("../orders/order.model");
const category_model_1 = require("../users/category.model");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.SECRET_KEY,
                signOptions: { expiresIn: '1day' },
            }),
            mongoose_1.MongooseModule.forFeature([
                { name: admin_model_1.Admin.name, schema: admin_model_1.AdminSchema, collection: 'admins' },
                { name: category_model_1.Category.name, schema: category_model_1.CategorySchema, collection: 'categories' },
                { name: users_model_1.User.name, schema: users_model_1.UserSchema, collection: 'users' },
                { name: order_model_1.Orders.name, schema: order_model_1.OrderSchema, collection: 'orders' },
            ]),
        ],
        providers: [admin_service_1.AdminService],
        controllers: [admin_controller_1.AdminController],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map