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
exports.PlaceSchema = exports.Place = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const swagger_1 = require("@nestjs/swagger");
const mongoose_2 = require("mongoose");
const user_types_1 = require("../users/utils/user.types");
let Place = class Place extends mongoose_2.Model {
};
exports.Place = Place;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Cafe Astoria', description: 'Place name' }),
    (0, mongoose_1.Prop)({
        type: String,
        minlength: 2,
        maxlength: 20,
        required: [true, 'Place name is required'],
    }),
    __metadata("design:type", String)
], Place.prototype, "placeName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'astoria@gmail.com', description: 'email' }),
    (0, mongoose_1.Prop)({ type: String, required: [true, 'Email is required'] }),
    __metadata("design:type", String)
], Place.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Cafeastoria-123545', description: 'password' }),
    (0, mongoose_1.Prop)({
        type: String,
        minlength: 8,
        required: [true, 'Password is required'],
    }),
    __metadata("design:type", String)
], Place.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'My restoran Astoria',
        description: 'Place post title',
    }),
    (0, mongoose_1.Prop)({
        type: String,
        minlength: 2,
        maxlength: 30,
    }),
    __metadata("design:type", String)
], Place.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'We are good coock',
        description: 'Place post description',
    }),
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], Place.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '+380987894556',
        description: 'Administrator place phone number',
    }),
    (0, mongoose_1.Prop)({
        type: String,
        minlength: 10,
        maxlength: 13,
    }),
    __metadata("design:type", String)
], Place.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '@YourLogin',
        description: 'Place telegram login',
    }),
    (0, mongoose_1.Prop)({
        type: String,
        minlength: 3,
        maxlength: 15,
    }),
    __metadata("design:type", String)
], Place.prototype, "telegram", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        default: null,
    }),
    __metadata("design:type", Number)
], Place.prototype, "tg_chat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '+380987894556',
        description: 'Place viber phone number',
    }),
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], Place.prototype, "viber", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        default: null,
    }),
    __metadata("design:type", String)
], Place.prototype, "viber_chat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '+380987894556',
        description: 'Place whatsapp phone number',
    }),
    (0, mongoose_1.Prop)({
        type: String,
        minlength: 10,
        maxlength: 13,
    }),
    __metadata("design:type", String)
], Place.prototype, "whatsapp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Kyiv',
        description: 'Place location',
    }),
    (0, mongoose_1.Prop)({
        type: String,
        default: 'Місто не обрано',
    }),
    __metadata("design:type", String)
], Place.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            publicId: '1',
            url: 'https://res.cloudinary.com/dciy3u6un/image/upload/v1717082688/service/b1ojvtvqnvrlllh35yb5.jpg',
        },
        description: 'Place master photo',
    }),
    (0, mongoose_1.Prop)({
        type: user_types_1.Photo,
        default: {
            publicId: '1',
            url: 'https://res.cloudinary.com/dciy3u6un/image/upload/v1717082688/service/b1ojvtvqnvrlllh35yb5.jpg',
        },
    }),
    __metadata("design:type", user_types_1.Photo)
], Place.prototype, "master_photo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            publicId: '1',
            url: 'https://res.cloudinary.com/dciy3u6un/image/upload/v1701114073/service/kglf7c13u3aagffbdlmo.png',
        },
        description: 'Place master photo',
    }),
    (0, mongoose_1.Prop)({
        type: user_types_1.Photo,
        default: {
            publicId: '1',
            url: 'https://res.cloudinary.com/dciy3u6un/image/upload/v1701114073/service/kglf7c13u3aagffbdlmo.png',
        },
    }),
    __metadata("design:type", user_types_1.Photo)
], Place.prototype, "avatar", void 0);
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
        description: 'Place photo',
    }),
    (0, mongoose_1.Prop)({
        type: [user_types_1.Photo],
        default: [],
    }),
    __metadata("design:type", Array)
], Place.prototype, "photo", void 0);
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
        description: 'User video',
    }),
    (0, mongoose_1.Prop)({
        type: [user_types_1.Photo],
        default: [],
    }),
    __metadata("design:type", Array)
], Place.prototype, "video", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: [
            {
                _id: '65258a576f9a7d99e555c7bd',
                name: 'Ресторанні послуги',
                subcategories: [
                    {
                        name: 'Банкетні зали',
                        id: '872c7525-ef5b-4dc3-9082-bdb98426fb1a',
                    },
                ],
            },
        ],
        description: 'Place category',
    }),
    (0, mongoose_1.Prop)({
        type: [user_types_1.Categories],
        default: [],
    }),
    __metadata("design:type", Array)
], Place.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'true', description: 'Place status' }),
    (0, mongoose_1.Prop)({
        type: Boolean,
        default: false,
    }),
    __metadata("design:type", Boolean)
], Place.prototype, "isOnline", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'true', description: 'Place paid' }),
    (0, mongoose_1.Prop)({
        type: Boolean,
        default: false,
    }),
    __metadata("design:type", Boolean)
], Place.prototype, "paid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'true', description: 'Place trial period' }),
    (0, mongoose_1.Prop)({
        type: Boolean,
        default: false,
    }),
    __metadata("design:type", Boolean)
], Place.prototype, "trial", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '100$',
        description: 'Place price',
    }),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Place.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '{Instagram: https://www.instagram.com/herlastsightband/}',
        description: 'Place social links',
    }),
    (0, mongoose_1.Prop)({
        type: Object,
        default: null,
    }),
    __metadata("design:type", user_types_1.Social)
], Place.prototype, "social", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0N2EzNzhiNGU4MTk3ODYzMzkwMTUyYSIsImlhdCI6MTY4NTczMTIxNCwiZXhwIjoxNjg1ODE3NjE0fQ.rxH3-wVl3VGGX675UCqOFrLx-1xNH-GObq9v7GbZj0s',
        description: 'JWT token',
    }),
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", String)
], Place.prototype, "token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0N2EzNzhiNGU4MTk3ODYzMzkwMTUyYSIsImlhdCI6MTY4NTczMTIxNCwiZXhwIjoxNjg1ODE3NjE0fQ.rxH3-wVl3VGGX675UCqOFrLx-1xNH-GObq9v7GbZj0s',
        description: 'JWT token',
    }),
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", String)
], Place.prototype, "refresh_token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'new', description: 'User moderate status' }),
    (0, mongoose_1.Prop)({
        type: String,
        default: 'new',
    }),
    __metadata("design:type", String)
], Place.prototype, "verified", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false, description: 'User email verify' }),
    (0, mongoose_1.Prop)({
        type: Boolean,
        default: false,
    }),
    __metadata("design:type", Boolean)
], Place.prototype, "verify", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'wVl3VGGX675UCqOFrLx-1xNH-GObq9v7GbZj0s',
        description: 'Google ID',
    }),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Place.prototype, "googleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'wVl3VGGX675UCqOFrLx-1xNH-GObq9v7GbZj0s',
        description: 'facebook ID',
    }),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], Place.prototype, "facebookId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        default: process.env.MASTER,
    }),
    __metadata("design:type", String)
], Place.prototype, "metaUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'false', description: 'User ban status' }),
    (0, mongoose_1.Prop)({
        type: Boolean,
        default: false,
    }),
    __metadata("design:type", Boolean)
], Place.prototype, "ban", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        default: 0,
    }),
    __metadata("design:type", Number)
], Place.prototype, "totalRating", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        default: 0,
    }),
    __metadata("design:type", Number)
], Place.prototype, "numberOfRatings", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        default: 0,
    }),
    __metadata("design:type", Number)
], Place.prototype, "agree_order", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        default: 0,
    }),
    __metadata("design:type", Number)
], Place.prototype, "disagree_order", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Date,
    }),
    __metadata("design:type", Date)
], Place.prototype, "trialEnds", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Date,
        default: new Date(),
    }),
    __metadata("design:type", Date)
], Place.prototype, "paidEnds", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Boolean,
        default: false,
    }),
    __metadata("design:type", Boolean)
], Place.prototype, "register", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Array, default: [] }),
    __metadata("design:type", Array)
], Place.prototype, "accepted_orders", void 0);
exports.Place = Place = __decorate([
    (0, mongoose_1.Schema)({ versionKey: false, timestamps: true })
], Place);
exports.PlaceSchema = mongoose_1.SchemaFactory.createForClass(Place);
//# sourceMappingURL=places.model.js.map