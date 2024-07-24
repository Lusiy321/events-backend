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
exports.search_place = exports.UpdatePlaceDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const user_types_1 = require("../../users/utils/user.types");
class UpdatePlaceDto {
}
exports.UpdatePlaceDto = UpdatePlaceDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Astoria', description: 'Place name' }),
    __metadata("design:type", String)
], UpdatePlaceDto.prototype, "placeName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'My cafe', description: 'Place post title' }),
    __metadata("design:type", String)
], UpdatePlaceDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'I coock good food',
        description: 'Place post description',
    }),
    __metadata("design:type", String)
], UpdatePlaceDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '380984561225', description: 'Place phone' }),
    __metadata("design:type", String)
], UpdatePlaceDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'YourLogin', description: 'Place telegram login' }),
    __metadata("design:type", String)
], UpdatePlaceDto.prototype, "telegram", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'YourLogin', description: 'Place viber login' }),
    __metadata("design:type", String)
], UpdatePlaceDto.prototype, "viber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '380984561225',
        description: 'Place whatsapp phone number',
    }),
    __metadata("design:type", String)
], UpdatePlaceDto.prototype, "whatsapp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Kyiv', description: 'Place location' }),
    __metadata("design:type", String)
], UpdatePlaceDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            publicId: '1',
            url: 'https://res.cloudinary.com/dciy3u6un/image/upload/v1701114073/service/kidn51ekkbiuqne4mbpl.jpg',
        },
        description: 'Place master photo',
    }),
    __metadata("design:type", user_types_1.Photo)
], UpdatePlaceDto.prototype, "master_photo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            publicId: '1',
            url: 'https://res.cloudinary.com/dciy3u6un/image/upload/v1701114073/service/kglf7c13u3aagffbdlmo.png',
        },
        description: 'Place master photo',
    }),
    __metadata("design:type", user_types_1.Photo)
], UpdatePlaceDto.prototype, "avatar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            publicId: '1',
            url: 'https://',
        },
        description: 'User video',
    }),
    __metadata("design:type", Array)
], UpdatePlaceDto.prototype, "video", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: [
            {
                publicId: '1',
                url: 'https://res.cloudinary.com/dciy3u6un/image/upload/v1701114073/service/kglf7c13u3aagffbdlmo.png',
            },
            {
                publicId: '2',
                url: 'https://res.cloudinary.com/dciy3u6un/image/upload/v1701114073/service/kidn51ekkbiuqne4mbpl.jpg',
            },
        ],
        description: 'User photo',
    }),
    __metadata("design:type", Array)
], UpdatePlaceDto.prototype, "photo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: { Facebook: 'https://www.facebook.com/psmirnyj/' },
        description: 'User social links',
    }),
    __metadata("design:type", user_types_1.Social)
], UpdatePlaceDto.prototype, "social", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'true', description: 'User status' }),
    __metadata("design:type", Boolean)
], UpdatePlaceDto.prototype, "isOnline", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '100$', description: 'Price' }),
    __metadata("design:type", String)
], UpdatePlaceDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'true', description: 'User paid' }),
    __metadata("design:type", Boolean)
], UpdatePlaceDto.prototype, "paid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'true', description: 'User trial period' }),
    __metadata("design:type", Boolean)
], UpdatePlaceDto.prototype, "trial", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'new', description: 'User moderate status' }),
    __metadata("design:type", String)
], UpdatePlaceDto.prototype, "verify", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'false', description: 'User ban status' }),
    __metadata("design:type", Boolean)
], UpdatePlaceDto.prototype, "ban", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'false', description: 'User register status' }),
    __metadata("design:type", Boolean)
], UpdatePlaceDto.prototype, "register", void 0);
class search_place {
}
exports.search_place = search_place;
//# sourceMappingURL=update.place.dto.js.map