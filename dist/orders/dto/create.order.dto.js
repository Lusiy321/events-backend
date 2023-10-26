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
exports.CreateOrderDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class CreateOrderDto {
}
exports.CreateOrderDto = CreateOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '380985633225', description: 'User phone' }),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Ivan Petrov',
        description: 'Your name',
    }),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "name", void 0);
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
        description: 'Order category',
    }),
    __metadata("design:type", Array)
], CreateOrderDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'I whand music band on 20:00 today',
        description: 'Order description',
    }),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Kyiv',
        description: 'User location',
    }),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '100$',
        description: 'User price',
    }),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '10.11.2024',
        description: 'Order data',
    }),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "date", void 0);
//# sourceMappingURL=create.order.dto.js.map