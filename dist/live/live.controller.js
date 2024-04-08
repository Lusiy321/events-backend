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
exports.LiveController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const live_service_1 = require("./live.service");
const live_model_1 = require("./live.model");
let LiveController = class LiveController {
    constructor(liveService) {
        this.liveService = liveService;
    }
    async like(req, postId) {
        return this.liveService.addLike(req, postId);
    }
    async dislike(req, postId) {
        return this.liveService.addDislike(req, postId);
    }
    async deletePost(req, postId) {
        return this.liveService.deletePost(req, postId);
    }
};
exports.LiveController = LiveController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Like post' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: live_model_1.Live }),
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('like'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LiveController.prototype, "like", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Dislike post' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: live_model_1.Live }),
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('dislike'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LiveController.prototype, "dislike", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete post' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: live_model_1.Live }),
    (0, common_1.HttpCode)(200),
    (0, common_1.Delete)('delete'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LiveController.prototype, "deletePost", null);
exports.LiveController = LiveController = __decorate([
    (0, swagger_1.ApiTags)('Live'),
    (0, common_1.Controller)('live'),
    __metadata("design:paramtypes", [live_service_1.LiveService])
], LiveController);
//# sourceMappingURL=live.controller.js.map