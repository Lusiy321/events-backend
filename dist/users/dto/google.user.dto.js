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
exports.GoogleUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class GoogleUserDto {
}
exports.GoogleUserDto = GoogleUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Volodymyr', description: 'User first name' }),
    __metadata("design:type", String)
], GoogleUserDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'zelenskiy@gmail.com', description: 'User email' }),
    __metadata("design:type", String)
], GoogleUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Vovan-123545', description: 'User password' }),
    __metadata("design:type", String)
], GoogleUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'I1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0N2EzN',
        description: 'Google ID',
    }),
    __metadata("design:type", String)
], GoogleUserDto.prototype, "googleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'true', description: 'User email verify' }),
    __metadata("design:type", Boolean)
], GoogleUserDto.prototype, "verify_google", void 0);
//# sourceMappingURL=google.user.dto.js.map