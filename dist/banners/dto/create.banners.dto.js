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
exports.CreateBannerDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class CreateBannerDto {
}
exports.CreateBannerDto = CreateBannerDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'title of banner', description: 'Banner title' }),
    __metadata("design:type", String)
], CreateBannerDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://', description: 'Banner img' }),
    __metadata("design:type", String)
], CreateBannerDto.prototype, "bannerImg", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Some text of banner', description: 'Banner text' }),
    __metadata("design:type", String)
], CreateBannerDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://', description: 'Banner URL' }),
    __metadata("design:type", String)
], CreateBannerDto.prototype, "link", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'go', description: 'Button Name' }),
    __metadata("design:type", String)
], CreateBannerDto.prototype, "linkName", void 0);
//# sourceMappingURL=create.banners.dto.js.map