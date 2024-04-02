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
exports.Subcategories = exports.Categories = exports.Social = exports.Photo = void 0;
const graphql_1 = require("@nestjs/graphql");
let Photo = class Photo {
};
exports.Photo = Photo;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Photo.prototype, "publicId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Photo.prototype, "url", void 0);
exports.Photo = Photo = __decorate([
    (0, graphql_1.ObjectType)('Photo')
], Photo);
let Social = class Social {
};
exports.Social = Social;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Social.prototype, "Instagram", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Social.prototype, "Facebook", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Social.prototype, "Youtube", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Social.prototype, "TikTok", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Social.prototype, "Vimeo", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Social.prototype, "SoundCloud", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Social.prototype, "Spotify", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Social.prototype, "AppleMusic", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Social.prototype, "Deezer", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Social.prototype, "WebSite", void 0);
exports.Social = Social = __decorate([
    (0, graphql_1.ObjectType)('Social')
], Social);
let Categories = class Categories {
};
exports.Categories = Categories;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], Categories.prototype, "_id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Categories.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(() => [Subcategories]),
    __metadata("design:type", Array)
], Categories.prototype, "subcategories", void 0);
exports.Categories = Categories = __decorate([
    (0, graphql_1.ObjectType)('Categories')
], Categories);
let Subcategories = class Subcategories {
};
exports.Subcategories = Subcategories;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], Subcategories.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Subcategories.prototype, "name", void 0);
exports.Subcategories = Subcategories = __decorate([
    (0, graphql_1.ObjectType)('Subcategory')
], Subcategories);
//# sourceMappingURL=user.types.js.map