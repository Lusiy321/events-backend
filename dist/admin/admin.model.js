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
exports.AdminSchema = exports.Admin = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const swagger_1 = require("@nestjs/swagger");
const mongoose_2 = require("mongoose");
const role_admin_dto_1 = require("./dto/role.admin.dto");
let Admin = class Admin extends mongoose_2.Model {
};
exports.Admin = Admin;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Volodymyr', description: 'Admin first name' }),
    (0, mongoose_1.Prop)({
        type: String,
        minlength: 2,
        maxlength: 20,
    }),
    __metadata("design:type", String)
], Admin.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'admin-123', description: 'Admin password' }),
    (0, mongoose_1.Prop)({
        type: String,
        minlength: 8,
        required: [true, 'Password is required'],
    }),
    __metadata("design:type", String)
], Admin.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://',
        description: 'User avatarURL',
    }),
    (0, mongoose_1.Prop)({
        type: String,
        default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
    }),
    __metadata("design:type", String)
], Admin.prototype, "avatar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '"admin" ,"moderator", "smm"',
        description: 'Admin role',
    }),
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['admin', 'moderator', 'smm'],
        default: 'moderator',
    }),
    __metadata("design:type", String)
], Admin.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0N2EzNzhiNGU4MTk3ODYzMzkwMTUyYSIsImlhdCI6MTY4NTczMTIxNCwiZXhwIjoxNjg1ODE3NjE0fQ.rxH3-wVl3VGGX675UCqOFrLx-1xNH-GObq9v7GbZj0s',
        description: 'JWT token',
    }),
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", String)
], Admin.prototype, "token", void 0);
exports.Admin = Admin = __decorate([
    (0, mongoose_1.Schema)({ versionKey: false, timestamps: true })
], Admin);
exports.AdminSchema = mongoose_1.SchemaFactory.createForClass(Admin);
//# sourceMappingURL=admin.model.js.map