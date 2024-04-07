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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const live_model_1 = require("./live.model");
const live_service_1 = require("./live.service");
const create_live_dto_1 = require("./dto/create.live.dto");
const GraphQLUpload = require("graphql-upload/GraphQLUpload.js");
const Upload = require("graphql-upload/Upload.js");
let LiveResolver = class LiveResolver {
    constructor(liveService) {
        this.liveService = liveService;
    }
    async getMessages(query) {
        return this.liveService.findAllUsersMessage(query);
    }
    async createMessage(context, image, data) {
        try {
            console.log(data, image);
            const file = await image;
            return await this.liveService.createMessage(context.req, data, file);
        }
        catch (error) {
            throw error;
        }
    }
};
exports.LiveResolver = LiveResolver;
__decorate([
    (0, graphql_1.Query)(() => create_live_dto_1.search_live, { name: 'messages' }),
    __param(0, (0, graphql_1.Args)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_live_dto_1.SearchLive]),
    __metadata("design:returntype", Promise)
], LiveResolver.prototype, "getMessages", null);
__decorate([
    (0, graphql_1.Mutation)(() => live_model_1.Live),
    __param(0, (0, graphql_1.Context)()),
    __param(1, (0, graphql_1.Args)({ name: 'image', type: () => GraphQLUpload, nullable: true })),
    __param(2, (0, graphql_1.Args)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_a = typeof Upload !== "undefined" && Upload) === "function" ? _a : Object, create_live_dto_1.CreateLiveDto]),
    __metadata("design:returntype", Promise)
], LiveResolver.prototype, "createMessage", null);
exports.LiveResolver = LiveResolver = __decorate([
    (0, graphql_1.Resolver)(() => live_model_1.Live),
    __metadata("design:paramtypes", [live_service_1.LiveService])
], LiveResolver);
//# sourceMappingURL=live.resolver.js.map