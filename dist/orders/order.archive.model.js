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
exports.OrdersArchiveSchema = exports.OrdersArchive = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const swagger_1 = require("@nestjs/swagger");
const mongoose_2 = require("mongoose");
let OrdersArchive = class OrdersArchive extends mongoose_2.Model {
};
exports.OrdersArchive = OrdersArchive;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '380987894556', description: 'User phone number' }),
    (0, mongoose_1.Prop)({
        type: String,
        minlength: 12,
        maxlength: 12,
        required: [true, 'User phone number'],
    }),
    __metadata("design:type", String)
], OrdersArchive.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Ivan Petrov',
        description: 'Your name',
    }),
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], OrdersArchive.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'I whand music band on 20:00 today',
        description: 'Order description',
    }),
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], OrdersArchive.prototype, "description", void 0);
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
        description: 'Order description',
    }),
    (0, mongoose_1.Prop)({
        type: (Array),
        default: [],
    }),
    __metadata("design:type", Array)
], OrdersArchive.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'YourLogin',
        description: 'Order telegram login',
    }),
    (0, mongoose_1.Prop)({
        type: String,
        minlength: 3,
        maxlength: 15,
    }),
    __metadata("design:type", String)
], OrdersArchive.prototype, "telegram", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        default: null,
    }),
    __metadata("design:type", Number)
], OrdersArchive.prototype, "tg_chat", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        default: 'none',
    }),
    __metadata("design:type", String)
], OrdersArchive.prototype, "botLink", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        default: 'none',
    }),
    __metadata("design:type", String)
], OrdersArchive.prototype, "exactLocation", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        default: null,
    }),
    __metadata("design:type", String)
], OrdersArchive.prototype, "viber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Kyiv',
        description: 'User location',
    }),
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], OrdersArchive.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '100$',
        description: 'User price',
    }),
    (0, mongoose_1.Prop)({
        type: String,
        default: 'За домовленістю',
    }),
    __metadata("design:type", String)
], OrdersArchive.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '10.11.2024',
        description: 'Order data',
        default: 'Не визначено',
    }),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], OrdersArchive.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'true', description: 'Order status' }),
    (0, mongoose_1.Prop)({
        type: Boolean,
        default: true,
    }),
    __metadata("design:type", Boolean)
], OrdersArchive.prototype, "active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123564', description: 'SMS code' }),
    (0, mongoose_1.Prop)({
        type: Number,
    }),
    __metadata("design:type", Number)
], OrdersArchive.prototype, "sms", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'true', description: 'Order verify' }),
    (0, mongoose_1.Prop)({
        type: Boolean,
        default: false,
    }),
    __metadata("design:type", Boolean)
], OrdersArchive.prototype, "verify", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123564', description: 'SMS code' }),
    (0, mongoose_1.Prop)({
        type: Number,
        default: 0,
    }),
    __metadata("design:type", Number)
], OrdersArchive.prototype, "approve_count", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Array, default: [] }),
    __metadata("design:type", Array)
], OrdersArchive.prototype, "accepted_users", void 0);
exports.OrdersArchive = OrdersArchive = __decorate([
    (0, mongoose_1.Schema)({ versionKey: false, timestamps: true })
], OrdersArchive);
exports.OrdersArchiveSchema = mongoose_1.SchemaFactory.createForClass(OrdersArchive);
//# sourceMappingURL=order.archive.model.js.map