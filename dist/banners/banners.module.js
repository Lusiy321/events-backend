"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannersModule = void 0;
const common_1 = require("@nestjs/common");
const banners_service_1 = require("./banners.service");
const banners_controller_1 = require("./banners.controller");
const mongoose_1 = require("@nestjs/mongoose");
const banners_model_1 = require("./banners.model");
let BannersModule = class BannersModule {
};
exports.BannersModule = BannersModule;
exports.BannersModule = BannersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: banners_model_1.Banner.name, schema: banners_model_1.BannerSchema, collection: 'banners' },
            ]),
        ],
        providers: [banners_service_1.BannersService],
        controllers: [banners_controller_1.BannersController],
    })
], BannersModule);
//# sourceMappingURL=banners.module.js.map