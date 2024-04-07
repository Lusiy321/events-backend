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
exports.search_live = exports.SearchLive = exports.CreateLiveDto = void 0;
const graphql_1 = require("@nestjs/graphql");
const swagger_1 = require("@nestjs/swagger");
const live_model_1 = require("../live.model");
let CreateLiveDto = class CreateLiveDto {
};
exports.CreateLiveDto = CreateLiveDto;
__decorate([
    (0, graphql_1.Field)(),
    (0, swagger_1.ApiProperty)({ example: 'Some text', description: 'Users text of post' }),
    __metadata("design:type", String)
], CreateLiveDto.prototype, "content", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://', description: 'Img URL' }),
    __metadata("design:type", String)
], CreateLiveDto.prototype, "image", void 0);
exports.CreateLiveDto = CreateLiveDto = __decorate([
    (0, graphql_1.InputType)()
], CreateLiveDto);
let SearchLive = class SearchLive {
};
exports.SearchLive = SearchLive;
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], SearchLive.prototype, "page", void 0);
__decorate([
    (0, graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], SearchLive.prototype, "limit", void 0);
exports.SearchLive = SearchLive = __decorate([
    (0, graphql_1.InputType)()
], SearchLive);
let search_live = class search_live {
};
exports.search_live = search_live;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], search_live.prototype, "totalPages", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], search_live.prototype, "currentPage", void 0);
__decorate([
    (0, graphql_1.Field)(() => [live_model_1.Live]),
    __metadata("design:type", Array)
], search_live.prototype, "data", void 0);
exports.search_live = search_live = __decorate([
    (0, graphql_1.ObjectType)()
], search_live);
//# sourceMappingURL=create.live.dto.js.map