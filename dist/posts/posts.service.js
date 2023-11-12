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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const posts_model_1 = require("./posts.model");
const mongoose_1 = require("@nestjs/mongoose");
const http_errors_1 = require("http-errors");
let PostsService = class PostsService {
    constructor(postsModel) {
        this.postsModel = postsModel;
    }
    async findAllPosts() {
        try {
            const find = await this.postsModel.find().exec();
            return find;
        }
        catch (e) {
            throw new http_errors_1.NotFound('Posts not found');
        }
    }
    async findById(id) {
        try {
            const find = await this.postsModel.findById(id).exec();
            return find;
        }
        catch (e) {
            throw new http_errors_1.NotFound('Posts not found');
        }
    }
    async create(posts) {
        try {
            const createPosts = await this.postsModel.create(posts);
            createPosts.save();
            return await this.postsModel.findById(createPosts._id);
        }
        catch (e) {
            throw new http_errors_1.BadRequest(e.message);
        }
    }
    async postUpdate(id, posts) {
        const params = __rest(posts, []);
        const post = await this.postsModel.findById({ _id: id });
        try {
            if (post) {
                await this.postsModel.findByIdAndUpdate({ _id: id }, Object.assign({}, params));
                return await this.postsModel.findById({ _id: id });
            }
            else {
                throw new http_errors_1.BadRequest('Post not found');
            }
        }
        catch (e) {
            throw new http_errors_1.BadRequest(e.message);
        }
    }
    async postDelete(id) {
        try {
            const find = await this.postsModel.findByIdAndRemove(id).exec();
            return find;
        }
        catch (e) {
            throw new http_errors_1.NotFound('Posts not found');
        }
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(posts_model_1.Posts.name)),
    __metadata("design:paramtypes", [posts_model_1.Posts])
], PostsService);
//# sourceMappingURL=posts.service.js.map