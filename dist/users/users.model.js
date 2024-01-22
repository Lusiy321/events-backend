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
exports.UserSchema = exports.User = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const swagger_1 = require("@nestjs/swagger");
const mongoose_2 = require("mongoose");
const verify_user_dto_1 = require("./dto/verify.user.dto");
let User = class User extends mongoose_2.Model {
};
exports.User = User;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Volodymyr', description: 'User first name' }),
    (0, mongoose_1.Prop)({
        type: String,
        minlength: 2,
        maxlength: 20,
    }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'zelenskiy@gmail.com', description: 'User email' }),
    (0, mongoose_1.Prop)({ type: String, required: [true, 'Email is required'] }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Vovan-123545', description: 'User password' }),
    (0, mongoose_1.Prop)({
        type: String,
        minlength: 8,
        required: [true, 'Password is required'],
    }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'My music work', description: 'User post title' }),
    (0, mongoose_1.Prop)({
        type: String,
        minlength: 2,
        maxlength: 30,
    }),
    __metadata("design:type", String)
], User.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'I sing song', description: 'User post description' }),
    (0, mongoose_1.Prop)({
        type: String,
        minlength: 2,
        maxlength: 400,
    }),
    __metadata("design:type", String)
], User.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '+380987894556',
        description: 'User phone number',
    }),
    (0, mongoose_1.Prop)({
        type: String,
        minlength: 10,
        maxlength: 13,
        default: '380000000000',
    }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '@YourLogin',
        description: 'User telegram login',
    }),
    (0, mongoose_1.Prop)({
        type: String,
        minlength: 3,
        maxlength: 15,
    }),
    __metadata("design:type", String)
], User.prototype, "telegram", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        default: null,
    }),
    __metadata("design:type", Number)
], User.prototype, "tg_chat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '+380987894556',
        description: 'User viber phone number',
    }),
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], User.prototype, "viber", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        default: null,
    }),
    __metadata("design:type", String)
], User.prototype, "viber_chat", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '+380987894556',
        description: 'User whatsapp phone number',
    }),
    (0, mongoose_1.Prop)({
        type: String,
        minlength: 10,
        maxlength: 13,
    }),
    __metadata("design:type", String)
], User.prototype, "whatsapp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Kyiv',
        description: 'User location',
    }),
    (0, mongoose_1.Prop)({
        type: String,
        default: 'Місто не обрано',
    }),
    __metadata("design:type", String)
], User.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            publicId: '1',
            url: 'https://res.cloudinary.com/dciy3u6un/image/upload/v1701114073/service/kidn51ekkbiuqne4mbpl.jpg',
        },
        description: 'User master photo',
    }),
    (0, mongoose_1.Prop)({
        type: Object,
        default: {
            publicId: '1',
            url: 'https://res.cloudinary.com/dciy3u6un/image/upload/v1701114073/service/kidn51ekkbiuqne4mbpl.jpg',
        },
    }),
    __metadata("design:type", Object)
], User.prototype, "master_photo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            publicId: '1',
            url: 'https://res.cloudinary.com/dciy3u6un/image/upload/v1701114073/service/kglf7c13u3aagffbdlmo.png',
        },
        description: 'User master photo',
    }),
    (0, mongoose_1.Prop)({
        type: Object,
        default: {
            publicId: '1',
            url: 'https://res.cloudinary.com/dciy3u6un/image/upload/v1701114073/service/kglf7c13u3aagffbdlmo.png',
        },
    }),
    __metadata("design:type", Object)
], User.prototype, "avatar", void 0);
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
    (0, mongoose_1.Prop)({
        type: (Array),
        default: [],
    }),
    __metadata("design:type", Array)
], User.prototype, "photo", void 0);
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
        type: (Array),
        default: [],
    }),
    __metadata("design:type", Array)
], User.prototype, "video", void 0);
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
                    {
                        name: 'Ді-джеї та звукорежисери',
                        id: '4bb29caa-f936-45df-baeb-6ca488404f55',
                    },
                    {
                        name: 'Кавер-групи',
                        id: '5843bd7-1d85-48e1-b225-56ff78e34514',
                    },
                    {
                        name: 'Сольні виконавці',
                        id: '5f24f679-54a1-4449-b03c-95fe36afb56c',
                    },
                ],
            },
        ],
        description: 'User category',
    }),
    (0, mongoose_1.Prop)({
        type: (Array),
        default: [],
    }),
    __metadata("design:type", Array)
], User.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'true', description: 'User status' }),
    (0, mongoose_1.Prop)({
        type: Boolean,
        default: false,
    }),
    __metadata("design:type", Boolean)
], User.prototype, "isOnline", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'true', description: 'User paid' }),
    (0, mongoose_1.Prop)({
        type: Boolean,
        default: false,
    }),
    __metadata("design:type", Boolean)
], User.prototype, "paid", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'true', description: 'User trial period' }),
    (0, mongoose_1.Prop)({
        type: Boolean,
        default: false,
    }),
    __metadata("design:type", Boolean)
], User.prototype, "trial", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '100$',
        description: 'User price',
    }),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], User.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '{Instagram: https://www.instagram.com/herlastsightband/}',
        description: 'User social links',
    }),
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], User.prototype, "social", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0N2EzNzhiNGU4MTk3ODYzMzkwMTUyYSIsImlhdCI6MTY4NTczMTIxNCwiZXhwIjoxNjg1ODE3NjE0fQ.rxH3-wVl3VGGX675UCqOFrLx-1xNH-GObq9v7GbZj0s',
        description: 'JWT token',
    }),
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", String)
], User.prototype, "token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0N2EzNzhiNGU4MTk3ODYzMzkwMTUyYSIsImlhdCI6MTY4NTczMTIxNCwiZXhwIjoxNjg1ODE3NjE0fQ.rxH3-wVl3VGGX675UCqOFrLx-1xNH-GObq9v7GbZj0s',
        description: 'JWT token',
    }),
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", String)
], User.prototype, "refresh_token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'new', description: 'User moderate status' }),
    (0, mongoose_1.Prop)({
        enum: ['new', 'approve', 'rejected'],
        default: 'new',
    }),
    __metadata("design:type", String)
], User.prototype, "verified", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false, description: 'User email verify' }),
    (0, mongoose_1.Prop)({
        type: Boolean,
        default: false,
    }),
    __metadata("design:type", Boolean)
], User.prototype, "verify", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'wVl3VGGX675UCqOFrLx-1xNH-GObq9v7GbZj0s',
        description: 'Google ID',
    }),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], User.prototype, "googleId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'wVl3VGGX675UCqOFrLx-1xNH-GObq9v7GbZj0s',
        description: 'facebook ID',
    }),
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], User.prototype, "facebookId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'false', description: 'User ban status' }),
    (0, mongoose_1.Prop)({
        type: Boolean,
        default: false,
    }),
    __metadata("design:type", Boolean)
], User.prototype, "ban", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        default: 0,
    }),
    __metadata("design:type", Number)
], User.prototype, "totalRating", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        default: 0,
    }),
    __metadata("design:type", Number)
], User.prototype, "numberOfRatings", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        default: 0,
    }),
    __metadata("design:type", Number)
], User.prototype, "agree_order", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        default: 0,
    }),
    __metadata("design:type", Number)
], User.prototype, "disagree_order", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Date,
    }),
    __metadata("design:type", Date)
], User.prototype, "trialEnds", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Date,
        default: new Date(),
    }),
    __metadata("design:type", Date)
], User.prototype, "paidEnds", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Array, default: [] }),
    __metadata("design:type", Array)
], User.prototype, "accepted_orders", void 0);
exports.User = User = __decorate([
    (0, mongoose_1.Schema)({ versionKey: false, timestamps: true })
], User);
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);
//# sourceMappingURL=users.model.js.map