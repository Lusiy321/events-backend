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
let BannersService = class BannersService {
    constructor(bannerModel) {
        this.bannerModel = bannerModel;
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
};
exports.BannersService = BannersService;
exports.BannersService = BannersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(banners_model_1.Banner.name)),
    __metadata("design:paramtypes", [banners_model_1.Banner])
], BannersService);
//# sourceMappingURL=banners.service.js.map