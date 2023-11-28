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
const position_banner_1 = require("./position.banner");
class CreateBannerDto {
}
exports.CreateBannerDto = CreateBannerDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://', description: 'Banner img' }),
    __metadata("design:type", String)
], CreateBannerDto.prototype, "img", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Some text of banner', description: 'Banner text' }),
    __metadata("design:type", String)
], CreateBannerDto.prototype, "text", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'top',
        description: 'Banner position: enum [top, left, right]',
    }),
    __metadata("design:type", String)
], CreateBannerDto.prototype, "role", void 0);
//# sourceMappingURL=create.banners.dto.js.map