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
exports.PlacesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const Guards_1 = require("../users/utils/Guards");
const GuardFacebook_1 = require("../users/utils/GuardFacebook");
const user_types_1 = require("../users/utils/user.types");
const places_service_1 = require("./places.service");
const cloudinary_service_1 = require("../users/cloudinary.service");
const places_model_1 = require("./places.model");
const create_place_dto_1 = require("./dto/create.place.dto");
const category_place_model_1 = require("./category.place.model");
const login_user_dto_1 = require("../users/dto/login.user.dto");
const update_place_dto_1 = require("./dto/update.place.dto");
const users_model_1 = require("../users/users.model");
const delete_user_dto_1 = require("./dto/delete.user.dto");
const google_user_dto_1 = require("../users/dto/google.user.dto");
const change_password_user_dto_1 = require("../users/dto/change-password.user.dto");
const email_user_dto_1 = require("./dto/email.user.dto");
const password_user_dto_1 = require("../users/dto/password.user.dto");
let PlacesController = class PlacesController {
    constructor(placesService, cloudinaryService) {
        this.placesService = placesService;
        this.cloudinaryService = cloudinaryService;
    }
    async create(place) {
        return this.placesService.create(place);
    }
    async findPlaces() {
        return this.placesService.findAllPlaces();
    }
    async findById(id) {
        return this.placesService.findById(id);
    }
    async findCat() {
        return this.placesService.findCategory();
    }
    async login(place) {
        return await this.placesService.login(place);
    }
    async logout(request) {
        return this.placesService.logout(request);
    }
    async update(data, request) {
        return this.placesService.updatePlace(data, request);
    }
    async updateCat(data, request) {
        return this.placesService.updateCategory(data, request);
    }
    async delCat(id, request) {
        return this.placesService.deleteCategory(id, request);
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
    async deleteProfile(res, request, password) {
        return await this.usersService.deleteUserProfile(request, password);
    }
    async setEmailPsw(email) {
        return this.usersService.sendVerificationEmail(email);
    }
    async verifyEmail(id) {
        const user = await this.usersService.verifyUserEmail(id);
        return user;
    }
};
exports.PlacesController = PlacesController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create Place' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: places_model_1.Place }),
    (0, common_1.Post)('/'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_place_dto_1.CreatePlaceDto]),
    __metadata("design:returntype", Promise)
], PlacesController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all places' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: places_model_1.Place }),
    (0, common_1.Get)('/find'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PlacesController.prototype, "findPlaces", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get place by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: places_model_1.Place }),
    (0, common_1.Get)('/find/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlacesController.prototype, "findById", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get category' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: category_place_model_1.CategoryPlace }),
    (0, common_1.Get)('category'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PlacesController.prototype, "findCat", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Login Place' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: places_model_1.Place }),
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_user_dto_1.LoginUserDto]),
    __metadata("design:returntype", Promise)
], PlacesController.prototype, "login", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Logout Place' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: places_model_1.Place }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PlacesController.prototype, "logout", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update place' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: places_model_1.Place }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Put)('/'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_place_dto_1.UpdatePlaceDto, Object]),
    __metadata("design:returntype", Promise)
], PlacesController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update place category' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: places_model_1.Place }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Put)('/update-category'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_types_1.Categories, Object]),
    __metadata("design:returntype", Promise)
], PlacesController.prototype, "updateCat", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delet place category' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: places_model_1.Place }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Delete)('/category/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PlacesController.prototype, "delCat", null);
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
], PlacesController.prototype, "deleteImage", null);
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
], PlacesController.prototype, "deleteVideo", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete user avatar' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: users_model_1.User }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Delete)('avatar'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PlacesController.prototype, "deleteAvatarImage", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Login Google User' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: google_user_dto_1.GoogleUserDto }),
    (0, common_1.Get)('google/login'),
    (0, common_1.UseGuards)(Guards_1.GoogleAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlacesController.prototype, "googleLogin", null);
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
], PlacesController.prototype, "googleAuthRedirect", null);
__decorate([
    (0, common_1.Get)('facebook/login'),
    (0, common_1.UseGuards)(GuardFacebook_1.FacebookAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlacesController.prototype, "facebookLogin", null);
__decorate([
    (0, common_1.Get)('facebook/redirect'),
    (0, common_1.UseGuards)(GuardFacebook_1.FacebookAuthGuard),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PlacesController.prototype, "facebookAuthRedirect", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Refresh Access Token' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Patch)('refresh'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PlacesController.prototype, "refresh", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Change password' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Patch)('change-password'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, change_password_user_dto_1.PasswordChangeDto]),
    __metadata("design:returntype", Promise)
], PlacesController.prototype, "cangePwd", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Forgot password email send' }),
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('forgot-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [email_user_dto_1.MailUserDto]),
    __metadata("design:returntype", Promise)
], PlacesController.prototype, "forgotPwd", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete user profile' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Delete)('delete-profile'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, password_user_dto_1.PasswordUserDto]),
    __metadata("design:returntype", Promise)
], PlacesController.prototype, "deleteProfile", null);
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
], PlacesController.prototype, "setEmailPsw", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Verify user email' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: Object }),
    (0, common_1.Get)('verify-email/:Id'),
    __param(0, (0, common_1.Param)('Id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlacesController.prototype, "verifyEmail", null);
exports.PlacesController = PlacesController = __decorate([
    (0, common_1.Controller)('places'),
    __metadata("design:paramtypes", [places_service_1.PlacesService,
        cloudinary_service_1.CloudinaryService])
], PlacesController);
//# sourceMappingURL=places.controller.js.map