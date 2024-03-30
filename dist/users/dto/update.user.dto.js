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
exports.search_result = exports.UpdateUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const user_types_1 = require("../utils/user.types");
const graphql_1 = require("@nestjs/graphql");
const users_model_1 = require("../users.model");
let UpdateUserDto = class UpdateUserDto {
};
exports.UpdateUserDto = UpdateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Volodymyr', description: 'User first name' }),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'My music work', description: 'User post title' }),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'I sing song', description: 'User post description' }),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '380984561225', description: 'User phone' }),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'YourLogin', description: 'User telegram login' }),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "telegram", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'YourLogin', description: 'User viber login' }),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "viber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '380984561225',
        description: 'User whatsapp phone number',
    }),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "whatsapp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Kyiv', description: 'User location' }),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            publicId: '1',
            url: 'https://res.cloudinary.com/dciy3u6un/image/upload/v1701114073/service/kidn51ekkbiuqne4mbpl.jpg',
        },
        description: 'User master photo',
    }),
    (0, graphql_1.Field)(() => user_types_1.Photo),
    __metadata("design:type", user_types_1.Photo)
], UpdateUserDto.prototype, "master_photo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            publicId: '1',
            url: 'https://res.cloudinary.com/dciy3u6un/image/upload/v1701114073/service/kglf7c13u3aagffbdlmo.png',
        },
        description: 'User master photo',
    }),
    (0, graphql_1.Field)(() => user_types_1.Photo),
    __metadata("design:type", user_types_1.Photo)
], UpdateUserDto.prototype, "avatar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            publicId: '1',
            url: 'https://',
        },
        description: 'User video',
    }),
    (0, graphql_1.Field)(() => [user_types_1.Photo]),
    __metadata("design:type", Array)
], UpdateUserDto.prototype, "video", void 0);
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
    (0, graphql_1.Field)(() => [user_types_1.Photo]),
    __metadata("design:type", Array)
], UpdateUserDto.prototype, "photo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: { Facebook: 'https://www.facebook.com/psmirnyj/' },
        description: 'User social links',
    }),
    (0, graphql_1.Field)(),
    __metadata("design:type", user_types_1.Social)
], UpdateUserDto.prototype, "social", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'true', description: 'User status' }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], UpdateUserDto.prototype, "isOnline", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '100$', description: 'Price' }),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'true', description: 'User paid' }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], UpdateUserDto.prototype, "paid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'true', description: 'User trial period' }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], UpdateUserDto.prototype, "trial", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'new', description: 'User moderate status' }),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "verify", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'false', description: 'User ban status' }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], UpdateUserDto.prototype, "ban", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'false', description: 'User register status' }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], UpdateUserDto.prototype, "register", void 0);
exports.UpdateUserDto = UpdateUserDto = __decorate([
    (0, graphql_1.InputType)('UpdateUser')
], UpdateUserDto);
let search_result = class search_result {
};
exports.search_result = search_result;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], search_result.prototype, "totalPages", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], search_result.prototype, "currentPage", void 0);
__decorate([
    (0, graphql_1.Field)(() => [users_model_1.User]),
    __metadata("design:type", Array)
], search_result.prototype, "data", void 0);
exports.search_result = search_result = __decorate([
    (0, graphql_1.ObjectType)('search_result')
], search_result);
//# sourceMappingURL=update.user.dto.js.map