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
exports.UpdateUserAdmDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const verify_user_dto_1 = require("../../users/dto/verify.user.dto");
class UpdateUserAdmDto {
}
exports.UpdateUserAdmDto = UpdateUserAdmDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'fksldflk88789dksfjl', description: 'User ID' }),
    __metadata("design:type", String)
], UpdateUserAdmDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Volodymyr', description: 'User first name' }),
    __metadata("design:type", String)
], UpdateUserAdmDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Zelenskiy', description: 'User last name' }),
    __metadata("design:type", String)
], UpdateUserAdmDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Vovan-123545', description: 'User password' }),
    __metadata("design:type", String)
], UpdateUserAdmDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'My music work', description: 'User post title' }),
    __metadata("design:type", String)
], UpdateUserAdmDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'I sing song', description: 'User post description' }),
    __metadata("design:type", String)
], UpdateUserAdmDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+380984561225', description: 'User phone' }),
    __metadata("design:type", String)
], UpdateUserAdmDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '@YourLogin', description: 'User telegram login' }),
    __metadata("design:type", String)
], UpdateUserAdmDto.prototype, "telegram", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+380984561225', description: 'User viber phone' }),
    __metadata("design:type", String)
], UpdateUserAdmDto.prototype, "viber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '+380984561225',
        description: 'User whatsapp phone number',
    }),
    __metadata("design:type", String)
], UpdateUserAdmDto.prototype, "whatsapp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Kyiv', description: 'User location' }),
    __metadata("design:type", String)
], UpdateUserAdmDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://', description: 'User photo' }),
    __metadata("design:type", String)
], UpdateUserAdmDto.prototype, "master_photo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: [{ id: '1', url: 'https://' }],
        description: 'User photo collection',
    }),
    __metadata("design:type", Array)
], UpdateUserAdmDto.prototype, "photo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['https://'], description: 'User photo collection' }),
    __metadata("design:type", Array)
], UpdateUserAdmDto.prototype, "video", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: [
            {
                _id: '65258a576f9a7d99e555c7bd',
                name: 'Музичні послуги',
                subcategories: [
                    {
                        name: 'Жива музика',
                        id: '872c7525-ef5b-4dc3-9082-bdb98426fb1a',
                    },
                ],
            },
        ],
        description: 'Category and subcategory',
    }),
    __metadata("design:type", Array)
], UpdateUserAdmDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '100$', description: 'Price' }),
    __metadata("design:type", String)
], UpdateUserAdmDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'true', description: 'User paid' }),
    __metadata("design:type", Boolean)
], UpdateUserAdmDto.prototype, "paid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'true', description: 'User status' }),
    __metadata("design:type", Boolean)
], UpdateUserAdmDto.prototype, "isOnline", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'true', description: 'User trial period' }),
    __metadata("design:type", Boolean)
], UpdateUserAdmDto.prototype, "trial", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['new', 'approve', 'rejected'],
        description: 'User moderate status',
    }),
    __metadata("design:type", String)
], UpdateUserAdmDto.prototype, "verify", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'false', description: 'User ban status' }),
    __metadata("design:type", Boolean)
], UpdateUserAdmDto.prototype, "ban", void 0);
//# sourceMappingURL=update.user.adm.dto.js.map