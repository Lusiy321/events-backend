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
exports.PostSchema = exports.Posts = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const swagger_1 = require("@nestjs/swagger");
const mongoose_2 = require("mongoose");
let Posts = class Posts extends mongoose_2.Model {
};
exports.Posts = Posts;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'It is a new post of more interesting information',
        description: 'Post title',
    }),
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], Posts.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'I whand music band on my restoran',
        description: 'Post description',
    }),
    (0, mongoose_1.Prop)({
        type: String,
    }),
    __metadata("design:type", String)
], Posts.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: [
            { publicId: '1', url: 'https://' },
            { publicId: '2', url: 'https://' },
        ],
        description: 'Post images',
    }),
    (0, mongoose_1.Prop)({
        type: (Array),
        default: [],
    }),
    __metadata("design:type", Array)
], Posts.prototype, "img", void 0);
exports.Posts = Posts = __decorate([
    (0, mongoose_1.Schema)({ versionKey: false, timestamps: true })
], Posts);
exports.PostSchema = mongoose_1.SchemaFactory.createForClass(Posts);
//# sourceMappingURL=posts.model.js.map