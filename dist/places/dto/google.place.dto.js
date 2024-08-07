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
exports.GooglePlaceDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const user_types_1 = require("../../users/utils/user.types");
class GooglePlaceDto {
}
exports.GooglePlaceDto = GooglePlaceDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Astoria', description: 'Place name' }),
    __metadata("design:type", String)
], GooglePlaceDto.prototype, "placeName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'zelenskiy@gmail.com', description: 'Place email' }),
    __metadata("design:type", String)
], GooglePlaceDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Vovan-123545', description: 'Place password' }),
    __metadata("design:type", String)
], GooglePlaceDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'I1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0N2EzN',
        description: 'Google ID',
    }),
    __metadata("design:type", String)
], GooglePlaceDto.prototype, "googleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            publicId: '1',
            url: 'https://res.cloudinary.com/dciy3u6un/image/upload/v1701114073/service/kglf7c13u3aagffbdlmo.png',
        },
        description: 'Place admin master photo',
    }),
    __metadata("design:type", user_types_1.Photo)
], GooglePlaceDto.prototype, "avatar", void 0);
//# sourceMappingURL=google.place.dto.js.map