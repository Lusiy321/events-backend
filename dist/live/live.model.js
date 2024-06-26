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
exports.LiveSchema = exports.Live = void 0;
const graphql_1 = require("@nestjs/graphql");
const mongoose_1 = require("@nestjs/mongoose");
const swagger_1 = require("@nestjs/swagger");
const mongoose_2 = require("mongoose");
let Live = class Live extends mongoose_2.Model {
};
exports.Live = Live;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], Live.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'User ID', description: 'author of text' }),
    (0, mongoose_1.Prop)({
        type: String,
    }),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Live.prototype, "author", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://', description: 'User avatar img' }),
    (0, mongoose_1.Prop)({
        type: String,
    }),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Live.prototype, "avatar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Some text', description: 'Users text of post' }),
    (0, mongoose_1.Prop)({
        type: String,
    }),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Live.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://', description: 'Img URL' }),
    (0, mongoose_1.Prop)({
        type: String,
        default: null,
    }),
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Live.prototype, "image", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '03.03.2025', description: 'Date of create' }),
    (0, mongoose_1.Prop)({
        type: Date,
        default: new Date(),
    }),
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], Live.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Array,
        default: [],
    }),
    (0, graphql_1.Field)(() => [String]),
    __metadata("design:type", Array)
], Live.prototype, "like", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Array,
        default: [],
    }),
    (0, graphql_1.Field)(() => [String]),
    __metadata("design:type", Array)
], Live.prototype, "dislikes", void 0);
exports.Live = Live = __decorate([
    (0, graphql_1.ObjectType)('Live'),
    (0, mongoose_1.Schema)({ versionKey: false, timestamps: false })
], Live);
exports.LiveSchema = mongoose_1.SchemaFactory.createForClass(Live);
//# sourceMappingURL=live.model.js.map