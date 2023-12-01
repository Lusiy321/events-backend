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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_model_1 = require("./users.model");
const users_service_1 = require("./users.service");
const create_user_dto_1 = require("./dto/create.user.dto");
const swagger_1 = require("@nestjs/swagger");
const update_user_dto_1 = require("./dto/update.user.dto");
const google_user_dto_1 = require("./dto/google.user.dto");
const Guards_1 = require("./utils/Guards");
const password_user_dto_1 = require("./dto/password.user.dto");
const email_user_dto_1 = require("./dto/email.user.dto");
const updatePassword_user_dto_1 = require("./dto/updatePassword.user.dto");
const category_model_1 = require("./category.model");
const create_category_dto_1 = require("./dto/create.category.dto");
const platform_express_1 = require("@nestjs/platform-express");
const cloudinary_service_1 = require("./cloudinary.service");
const multer_1 = require("multer");
const path = require("path");
const delete_user_dto_1 = require("./dto/delete.user.dto");
let UsersController = class UsersController {
    constructor(usersService, cloudinaryService) {
        this.usersService = usersService;
        this.cloudinaryService = cloudinaryService;
    }
    async create(user) {
        return this.usersService.create(user);
    }
    async searchUser(query) {
        return this.usersService.searchUsers(query);
    }
    async findUsers() {
        return this.usersService.findAllUsers();
    }
    async findById(id) {
        return this.usersService.findById(id);
    }
    async findCat() {
        return this.usersService.findCategory();
    }
    async login(user) {
        return await this.usersService.login(user);
    }
    async logout(request) {
        return this.usersService.logout(request);
    }
    async update(data, request) {
        return this.usersService.update(data, request);
    }
    async uploadPhoto(req, images) {
        const user = await this.usersService.findToken(req);
        await this.cloudinaryService.uploadImages(user, images);
        return await this.usersService.findById(user.id);
    }
    async uploadUserAvatar(req, images) {
        const user = await this.usersService.findToken(req);
        await this.cloudinaryService.uploadAvatar(user, images);
        return await this.usersService.findById(user.id);
    }
    async deleteImage(id, req) {
        const user = await this.usersService.findToken(req);
        await this.cloudinaryService.deleteImage(user, id.id);
        return await this.usersService.findById(user.id);
    }
    async deleteVideo(id, req) {
        return await this.usersService.deleteUserVideo(id, req);
    }
    async deleteAvatarImage(req) {
        const user = await this.usersService.findToken(req);
        await this.cloudinaryService.deleteAvatarImage(user);
        return await this.usersService.findById(user.id);
    }
    async googleLogin() {
        return;
    }
    async googleAuthRedirect(res, req) {
        const userId = req.user.id;
        const user = await this.usersService.findById(userId);
        return res.redirect(`${process.env.FRONT_LINK}?token=${user.token}`);
    }
    async createCat(category) {
        return this.usersService.createCategory(category);
    }
    async addSubcategory(id, subCategory) {
        return this.usersService.addSubcategory(id, subCategory);
    }
    async findCategoryId(id) {
        return this.usersService.findUserCategory(id);
    }
    async findSubcategoryId(id) {
        return this.usersService.findUserSubcategory(id);
    }
    async refresh(request) {
        return await this.usersService.refreshAccessToken(request);
    }
    async cangePwd(request, password) {
        return await this.usersService.changePassword(request, password);
    }
    async forgotPwd(email) {
        return await this.usersService.restorePassword(email);
    }
    async setUpdatePsw(id, password) {
        return this.usersService.updateRestorePassword(id, password);
    }
    async verifyEmail(id, res) {
        await this.usersService.verifyUserEmail(id);
        return res.redirect(`https://show-git-main-smirnypavel.vercel.app`);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create User' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: users_model_1.User }),
    (0, common_1.Post)('/'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Search posts from query ( ?req= )' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: [users_model_1.User] }),
    (0, common_1.Get)('/'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "searchUser", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all users' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: users_model_1.User }),
    (0, common_1.Get)('/find'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findUsers", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get user by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: users_model_1.User }),
    (0, common_1.Get)('/find/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findById", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get category' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: category_model_1.Category }),
    (0, common_1.Get)('category'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findCat", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Login User' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: users_model_1.User }),
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "login", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Logout User' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: users_model_1.User }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "logout", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update user' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: users_model_1.User }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Put)('/'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_user_dto_1.UpdateUserDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Upload images' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: users_model_1.User }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('file', 5, {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, cb) => {
                const filename = path.parse(file.originalname).name.replace(/\s/g, '') +
                    '-' +
                    Date.now();
                const extension = path.parse(file.originalname).ext;
                cb(null, `${filename}${extension}`);
            },
        }),
    })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "uploadPhoto", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Avatar image upload' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: users_model_1.User }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Post)('avatar'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('file', 1, {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, cb) => {
                const filename = path.parse(file.originalname).name.replace(/\s/g, '') +
                    '-' +
                    Date.now();
                const extension = path.parse(file.originalname).ext;
                cb(null, `${filename}${extension}`);
            },
        }),
    })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "uploadUserAvatar", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete user photo  (Body {id: kdsjfksdjfl})' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: users_model_1.User }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Put)('photo'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_user_dto_1.DelUserMediaDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteImage", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete user video' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: users_model_1.User }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Delete)('video/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteVideo", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete user avatar' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: users_model_1.User }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Delete)('avatar'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteAvatarImage", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Login Google User' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: google_user_dto_1.GoogleUserDto }),
    (0, common_1.Get)('google/login'),
    (0, common_1.UseGuards)(Guards_1.GoogleAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "googleLogin", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Google Authentication' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: google_user_dto_1.GoogleUserDto }),
    (0, common_1.Get)('google/redirect'),
    (0, common_1.UseGuards)(Guards_1.GoogleAuthGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "googleAuthRedirect", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Создание категории в БД с категориями' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: category_model_1.Category }),
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('/category/add'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createCat", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Добавление подкатегории в БД с категориями' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: category_model_1.Category }),
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('/subcategories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_category_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "addSubcategory", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Сортировка по категориям пользователей' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: users_model_1.User }),
    (0, common_1.Get)('/findCategory/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findCategoryId", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Сортировка по подкатегориям пользователей' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: users_model_1.User }),
    (0, common_1.Get)('/findSubcategory/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findSubcategoryId", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Refresh Access Token' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Patch)('refresh'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "refresh", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Change password' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Patch)('change-password'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, password_user_dto_1.PasswordUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "cangePwd", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Forgot password email send' }),
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [email_user_dto_1.MailUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "forgotPwd", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Update password for forgot password',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: users_model_1.User }),
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('/update-password/:Id'),
    __param(0, (0, common_1.Param)('Id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, updatePassword_user_dto_1.UpdatePasswordUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "setUpdatePsw", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Verify user email' }),
    (0, common_1.Patch)('verify-email/:Id'),
    __param(0, (0, common_1.Param)('Id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "verifyEmail", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('User'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        cloudinary_service_1.CloudinaryService])
], UsersController);
//# sourceMappingURL=users.controller.js.map