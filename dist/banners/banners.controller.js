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
exports.BannersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const banners_service_1 = require("./banners.service");
const banners_model_1 = require("./banners.model");
const create_banners_dto_1 = require("./dto/create.banners.dto");
let BannersController = class BannersController {
    constructor(bannerService) {
        this.bannerService = bannerService;
    }
    async create(data) {
        return this.bannerService.createBanner(data);
    }
    async findBanners() {
        return this.bannerService.findAllBanners();
    }
    async findBannerById(id) {
        return this.bannerService.findBannerById(id);
    }
    async updateBanners(id, data) {
        return this.bannerService.updateBanner(id, data);
    }
    async findBannerAndDel(id) {
        return this.bannerService.deleteBanner(id);
    }
};
exports.BannersController = BannersController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create banner' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: banners_model_1.Banner }),
    (0, common_1.Post)('/'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_banners_dto_1.CreateBannerDto]),
    __metadata("design:returntype", Promise)
], BannersController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get all banners',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: banners_model_1.Banner }),
    (0, common_1.Get)('/'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BannersController.prototype, "findBanners", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get banner by ID',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: banners_model_1.Banner }),
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BannersController.prototype, "findBannerById", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Update banner by ID',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: banners_model_1.Banner }),
    (0, common_1.Put)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_banners_dto_1.CreateBannerDto]),
    __metadata("design:returntype", Promise)
], BannersController.prototype, "updateBanners", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Remove banner by ID',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: banners_model_1.Banner }),
    (0, common_1.Delete)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BannersController.prototype, "findBannerAndDel", null);
exports.BannersController = BannersController = __decorate([
    (0, swagger_1.ApiTags)('Banner'),
    (0, common_1.Controller)('banners'),
    __metadata("design:paramtypes", [banners_service_1.BannersService])
], BannersController);
//# sourceMappingURL=banners.controller.js.map