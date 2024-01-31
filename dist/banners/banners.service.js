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
exports.BannersService = void 0;
const common_1 = require("@nestjs/common");
const banners_model_1 = require("./banners.model");
const mongoose_1 = require("@nestjs/mongoose");
const http_errors_1 = require("http-errors");
const users_model_1 = require("../users/users.model");
let BannersService = class BannersService {
    constructor(bannerModel, userModel) {
        this.bannerModel = bannerModel;
        this.userModel = userModel;
    }
    async createBanner(banner) {
        try {
            const creat = await this.bannerModel.create(banner);
            creat.save();
            return await this.bannerModel.findById(creat._id);
        }
        catch (e) {
            throw new http_errors_1.BadRequest(e.message);
        }
    }
    async findAllBanners() {
        try {
            const find = await this.bannerModel.find().exec();
            return find;
        }
        catch (e) {
            throw new http_errors_1.NotFound('Banners not found');
        }
    }
    async findBannerById(id) {
        try {
            const find = await this.bannerModel.findById(id).exec();
            return find;
        }
        catch (e) {
            throw new http_errors_1.NotFound('Banner not found');
        }
    }
    async deleteBanner(id) {
        try {
            const find = await this.bannerModel.findByIdAndRemove(id).exec();
            return find;
        }
        catch (e) {
            throw new http_errors_1.NotFound('Banner not found');
        }
    }
    async updateBanner(id, data) {
        try {
            const params = __rest(data, []);
            const find = await this.bannerModel
                .findByIdAndUpdate({ _id: id }, Object.assign({}, params))
                .exec();
            return find;
        }
        catch (e) {
            throw new http_errors_1.NotFound('Banner not found');
        }
    }
    async getRightBanner() {
        try {
            const music = await this.userModel
                .aggregate([
                { $unwind: '$category' },
                {
                    $match: {
                        'category._id': '65258a576f9a7d99e555c7bd',
                    },
                },
                { $match: { verify: true } },
                { $sample: { size: 3 } },
            ])
                .exec();
            const animators = await this.userModel
                .aggregate([
                { $unwind: '$category' },
                {
                    $match: {
                        'category._id': '65258abb6f9a7d99e555c7ce',
                    },
                },
                { $match: { verify: true } },
                { $sample: { size: 3 } },
            ])
                .exec();
            const photo = await this.userModel
                .aggregate([
                { $unwind: '$category' },
                {
                    $match: {
                        'category._id': '65258b446f9a7d99e555c7e2',
                    },
                },
                { $match: { verify: true } },
                { $sample: { size: 3 } },
            ])
                .exec();
            const decorations = await this.userModel
                .aggregate([
                { $unwind: '$category' },
                {
                    $match: {
                        'category._id': '65258b9d6f9a7d99e555c7f3',
                    },
                },
                { $match: { verify: true } },
                { $sample: { size: 3 } },
            ])
                .exec();
            const catering = await this.userModel
                .aggregate([
                { $unwind: '$category' },
                {
                    $match: {
                        'category._id': '65258c516f9a7d99e555c804',
                    },
                },
                { $match: { verify: true } },
                { $sample: { size: 3 } },
            ])
                .exec();
            const rent = await this.userModel
                .aggregate([
                { $unwind: '$category' },
                {
                    $match: {
                        'category._id': '65258ca76f9a7d99e555c815',
                    },
                },
                { $match: { verify: true } },
                { $sample: { size: 3 } },
            ])
                .exec();
            const organ = await this.userModel
                .aggregate([
                { $unwind: '$category' },
                {
                    $match: {
                        'category._id': '65258cf26f9a7d99e555c826',
                    },
                },
                { $match: { verify: true } },
                { $sample: { size: 3 } },
            ])
                .exec();
            const corporative = await this.userModel
                .aggregate([
                { $unwind: '$category' },
                {
                    $match: {
                        'category._id': '6525924f78a57a652732329d',
                    },
                },
                { $match: { verify: true } },
                { $sample: { size: 3 } },
            ])
                .exec();
            const weddings = await this.userModel
                .aggregate([
                { $unwind: '$category' },
                {
                    $match: {
                        'category._id': '6525934f78a57a65273232b1',
                    },
                },
                { $match: { verify: true } },
                { $sample: { size: 3 } },
            ])
                .exec();
            return [
                { id: 1, name: 'Музичні послуги', data: music },
                { id: 2, name: 'Анімаційні послуги', data: animators },
                { id: 3, name: 'Фото та відео', data: photo },
                { id: 4, name: 'Декорації та дизайн', data: decorations },
                { id: 5, name: 'Кейтеринг та розваги', data: catering },
                { id: 6, name: 'Оренда обладнання', data: rent },
                { id: 7, name: 'Послуги організації', data: organ },
                { id: 8, name: 'Корпоративні заходи', data: corporative },
                { id: 9, name: 'Весілля та ювілеї', data: weddings },
            ];
        }
        catch (e) {
            throw new http_errors_1.NotFound(`Banner not found: ${e}`);
        }
    }
};
exports.BannersService = BannersService;
exports.BannersService = BannersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(banners_model_1.Banner.name)),
    __param(1, (0, mongoose_1.InjectModel)(users_model_1.User.name)),
    __metadata("design:paramtypes", [banners_model_1.Banner,
        users_model_1.User])
], BannersService);
//# sourceMappingURL=banners.service.js.map