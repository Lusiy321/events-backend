"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const users_controller_1 = require("./users.controller");
const mongoose_1 = require("@nestjs/mongoose");
const users_model_1 = require("./users.model");
const jwt_1 = require("@nestjs/jwt");
const GoogleStrategy_1 = require("./utils/GoogleStrategy");
const Serializer_1 = require("./utils/Serializer");
const category_model_1 = require("./category.model");
const cloudinary_service_1 = require("./cloudinary.service");
const config_1 = require("@nestjs/config");
const platform_express_1 = require("@nestjs/platform-express");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.SECRET_KEY,
                signOptions: { expiresIn: '1day' },
            }),
            mongoose_1.MongooseModule.forFeature([
                { name: users_model_1.User.name, schema: users_model_1.UserSchema, collection: 'users' },
                { name: category_model_1.Category.name, schema: category_model_1.CategorySchema, collection: 'categories' },
            ]),
            platform_express_1.MulterModule.register({
                dest: './uploads',
            }),
        ],
        providers: [
            GoogleStrategy_1.GoogleStrategy,
            Serializer_1.SessionSerializer,
            { provide: 'USER_SERVICE', useClass: users_service_1.UsersService },
            users_service_1.UsersService,
            cloudinary_service_1.CloudinaryService,
            config_1.ConfigService,
        ],
        exports: [users_service_1.UsersService, cloudinary_service_1.CloudinaryService],
        controllers: [users_controller_1.UsersController],
    })
], UsersModule);
//# sourceMappingURL=users.module.js.map