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
const http_errors_1 = require("http-errors");
const swagger_1 = require("@nestjs/swagger");
const update_user_dto_1 = require("./dto/update.user.dto");
const google_user_dto_1 = require("./dto/google.user.dto");
const Guards_1 = require("./utils/Guards");
const change_password_user_dto_1 = require("./dto/change-password.user.dto");
const email_user_dto_1 = require("./dto/email.user.dto");
const category_model_1 = require("./category.model");
const platform_express_1 = require("@nestjs/platform-express");
const cloudinary_service_1 = require("./cloudinary.service");
const multer_1 = require("multer");
const path = require("path");
const delete_user_dto_1 = require("./dto/delete.user.dto");
const GuardFacebook_1 = require("./utils/GuardFacebook");
const search_service_1 = require("./search.service");
const password_user_dto_1 = require("./dto/password.user.dto");
const user_types_1 = require("./utils/user.types");
const login_user_dto_1 = require("./dto/login.user.dto");
let UsersController = class UsersController {
    constructor(usersService, searchService, cloudinaryService) {
        this.usersService = usersService;
        this.searchService = searchService;
        this.cloudinaryService = cloudinaryService;
    }
    async create(user) {
        return this.usersService.create(user);
    }
    async searchUser(query) {
        return this.searchService.searchUsers(query);
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
    async firstRegister(data, request) {
        return this.usersService.firstRegisterUser(data, request);
    }
    async update(data, request) {
        return this.usersService.updateUser(data, request);
    }
    async updateCat(data, request) {
        return this.usersService.updateCategory(data, request);
    }
    async delCat(id, request) {
        return this.usersService.deleteCategory(id, request);
    }
    async uploadPhoto(req, images) {
        console.log(images, images.length);
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
    googleLogin() {
        return;
    }
    async googleAuthRedirect(res, req) {
        const userId = req.user.id;
        const user = await this.usersService.findById(userId);
        return res.redirect(`${process.env.FRONT_LINK}?token=${user.refresh_token}`);
    }
    facebookLogin() {
        return;
    }
    async facebookAuthRedirect(res, req) {
        const userId = req.user.id;
        const user = await this.usersService.findById(userId);
        return res.redirect(`${process.env.FRONT_LINK}?token=${user.refresh_token}`);
    }
    async refresh(req) {
        return await this.usersService.refreshAccessToken(req);
    }
    async cangePwd(request, password) {
        return await this.usersService.changePassword(request, password);
    }
    async forgotPwd(email) {
        await this.usersService.restorePassword(email);
        return { message: 'Email send' };
    }
    async deleteProfile(request, password) {
        if (password.password === undefined) {
            throw new http_errors_1.BadRequest('Password is not avaible');
        }
        else {
            return await this.usersService.deleteUserProfile(request, password);
        }
    }
    async setEmailPsw(email) {
        return this.usersService.sendVerificationEmail(email);
    }
    async verifyEmail(id) {
        const user = await this.usersService.verifyUserEmail(id);
        return user;
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
    (0, swagger_1.ApiOperation)({
        summary: 'Search posts from query ( ?req=музикант&loc=Київ )',
    }),
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
    __metadata("design:paramtypes", [login_user_dto_1.LoginUserDto]),
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
    (0, swagger_1.ApiOperation)({ summary: 'First register user' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: users_model_1.User }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Put)('/registration'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_user_dto_1.UpdateUserDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "firstRegister", null);
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
    (0, swagger_1.ApiOperation)({ summary: 'Update user' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: users_model_1.User }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Put)('/update-category'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_types_1.Categories, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateCat", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delet category' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: users_model_1.User }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Delete)('/category/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "delCat", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Upload images' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: users_model_1.User }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.HttpCode)(200),
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
    __metadata("design:returntype", void 0)
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
    (0, common_1.Get)('facebook/login'),
    (0, common_1.UseGuards)(GuardFacebook_1.FacebookAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "facebookLogin", null);
__decorate([
    (0, common_1.Get)('facebook/redirect'),
    (0, common_1.UseGuards)(GuardFacebook_1.FacebookAuthGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "facebookAuthRedirect", null);
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
    __metadata("design:paramtypes", [Object, change_password_user_dto_1.PasswordChangeDto]),
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
    (0, swagger_1.ApiOperation)({ summary: 'Delete user profile' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('delete-profile'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, password_user_dto_1.PasswordUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteProfile", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Send link to verify email',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: Object }),
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('/send-email/:email'),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "setEmailPsw", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Verify user email' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: Object }),
    (0, common_1.Get)('verify-email/:Id'),
    __param(0, (0, common_1.Param)('Id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "verifyEmail", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('User'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        search_service_1.SearchService,
        cloudinary_service_1.CloudinaryService])
], UsersController);
//# sourceMappingURL=users.controller.js.map