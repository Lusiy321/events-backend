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
exports.CategoryPlaceSchema = exports.CategoryPlace = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const swagger_1 = require("@nestjs/swagger");
const mongoose_2 = require("mongoose");
let CategoryPlace = class CategoryPlace extends mongoose_2.Model {
};
exports.CategoryPlace = CategoryPlace;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Ресторани', description: 'Category name' }),
    (0, mongoose_1.Prop)({
        type: String,
        minlength: 2,
        maxlength: 30,
        required: [true, 'Category name is required'],
    }),
    __metadata("design:type", String)
], CategoryPlace.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: [
            { id: 101, name: 'Бари' },
            { id: 102, name: 'Кафе' },
        ],
        description: 'Subcategories',
        default: [],
    }),
    (0, mongoose_1.Prop)({
        type: (Array),
        default: [],
    }),
    __metadata("design:type", Array)
], CategoryPlace.prototype, "subcategories", void 0);
exports.CategoryPlace = CategoryPlace = __decorate([
    (0, mongoose_1.Schema)({ versionKey: false, timestamps: true })
], CategoryPlace);
exports.CategoryPlaceSchema = mongoose_1.SchemaFactory.createForClass(CategoryPlace);
//# sourceMappingURL=category.place.model.js.map