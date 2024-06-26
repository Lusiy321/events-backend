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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannerSchema = exports.Banner = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const swagger_1 = require("@nestjs/swagger");
const mongoose_2 = require("mongoose");
let Banner = class Banner extends mongoose_2.Model {
};
exports.Banner = Banner;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'title of banner', description: 'Banner title' }),
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], Banner.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://', description: 'Banner img' }),
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], Banner.prototype, "bannerImg", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Some text of banner', description: 'Banner text' }),
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], Banner.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://', description: 'Banner URL' }),
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], Banner.prototype, "link", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'go', description: 'Button Name' }),
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], Banner.prototype, "linkName", void 0);
exports.Banner = Banner = __decorate([
    (0, mongoose_1.Schema)({ versionKey: false, timestamps: true })
], Banner);
exports.BannerSchema = mongoose_1.SchemaFactory.createForClass(Banner);
//# sourceMappingURL=banners.model.js.map