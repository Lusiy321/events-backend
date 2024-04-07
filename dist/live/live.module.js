"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveModule = void 0;
const common_1 = require("@nestjs/common");
const live_service_1 = require("./live.service");
const mongoose_1 = require("@nestjs/mongoose");
const live_model_1 = require("./live.model");
const users_model_1 = require("../users/users.model");
const live_controller_1 = require("./live.controller");
const live_resolver_1 = require("./live.resolver");
const cloudinary_service_1 = require("../users/cloudinary.service");
let LiveModule = class LiveModule {
};
exports.LiveModule = LiveModule;
exports.LiveModule = LiveModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: live_model_1.Live.name, schema: live_model_1.LiveSchema, collection: 'live' },
                { name: users_model_1.User.name, schema: users_model_1.UserSchema, collection: 'users' },
            ]),
        ],
        controllers: [live_controller_1.LiveController],
        providers: [live_service_1.LiveService, live_resolver_1.LiveResolver, cloudinary_service_1.CloudinaryService],
    })
], LiveModule);
//# sourceMappingURL=live.module.js.map