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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const users_model_1 = require("../users/users.model");
const live_model_1 = require("./live.model");
const http_errors_1 = require("http-errors");
const jsonwebtoken_1 = require("jsonwebtoken");
let LiveService = class LiveService {
    constructor(userModel, liveModel) {
        this.userModel = userModel;
        this.liveModel = liveModel;
    }
    async findAllUsers() {
        try {
            const find = await this.liveModel.find();
            return find;
        }
        catch (e) {
            throw new http_errors_1.NotFound('User not found');
        }
    }
    async create(req, content) {
        try {
            const user = await this.findToken(req);
            if (!user) {
                throw new http_errors_1.Unauthorized('jwt expired');
            }
            const createdLive = await this.liveModel.create(Object.assign(Object.assign({}, content), { avatar: user.avatar.url, author: user._id }));
            createdLive.save();
            return await this.liveModel.findById(createdLive._id).exec();
        }
        catch (e) {
            throw e;
        }
    }
    async findToken(req) {
        try {
            const { authorization = '' } = req.headers;
            const [bearer, token] = authorization.split(' ');
            if (bearer !== 'Bearer') {
                throw new http_errors_1.Unauthorized('Not authorized');
            }
            else {
                const SECRET_KEY = process.env.SECRET_KEY;
                const findId = (0, jsonwebtoken_1.verify)(token, SECRET_KEY);
                const user = await this.userModel.findById({ _id: findId.id }).exec();
                return user;
            }
        }
        catch (e) {
            if (e.message === 'jwt expired') {
                throw new http_errors_1.Unauthorized('jwt expired');
            }
            else {
                throw e;
            }
        }
    }
};
exports.LiveService = LiveService;
exports.LiveService = LiveService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(users_model_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(live_model_1.Live.name)),
    __metadata("design:paramtypes", [users_model_1.User,
        live_model_1.Live])
], LiveService);
//# sourceMappingURL=live.service.js.map