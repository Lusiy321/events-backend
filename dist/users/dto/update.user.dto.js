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
exports.UpdateUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class UpdateUserDto {
}
exports.UpdateUserDto = UpdateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'fksldflk88789dksfjl', description: 'User ID' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Volodymyr', description: 'User first name' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Zelenskiy', description: 'User last name' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Vovan-123545', description: 'User password' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'My music work', description: 'User post title' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'I sing song', description: 'User post description' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+380984561225', description: 'User phone' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '@YourLogin', description: 'User telegram login' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "telegram", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+380984561225', description: 'User viber phone' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "viber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '+380984561225',
        description: 'User whatsapp phone number',
    }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "whatsapp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Kyiv', description: 'User location' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://', description: 'User photo' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "master_photo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: [{ id: '1', url: 'https://' }],
        description: 'User photo collection',
    }),
    __metadata("design:type", Array)
], UpdateUserDto.prototype, "photo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['https://'], description: 'User photo collection' }),
    __metadata("design:type", Array)
], UpdateUserDto.prototype, "video", void 0);
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
], UpdateUserDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '100$', description: 'Price' }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "price", void 0);
//# sourceMappingURL=update.user.dto.js.map