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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admin_service_1 = require("./admin.service");
const users_model_1 = require("../users/users.model");
const admin_model_1 = require("./admin.model");
const create_admin_dto_1 = require("./dto/create.admin.dto");
const update_user_dto_1 = require("../users/dto/update.user.dto");
const order_model_1 = require("../orders/order.model");
const verify_user_dto_1 = require("../users/dto/verify.user.dto");
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    async create(adm, req) {
        return this.adminService.createAdmin(adm, req);
    }
    async findAdmins(req) {
        return this.adminService.findAllAdmins(req);
    }
    async findAdminId(id, req) {
        return this.adminService.findAdminById(id, req);
    }
    async login(adm) {
        return await this.adminService.login(adm);
    }
    async logout(req) {
        return this.adminService.logout(req);
    }
    async refresh(req) {
        return await this.adminService.refreshAccessToken(req);
    }
    async find(id, user, req) {
        return this.adminService.findByIdUpdate(id, user, req);
    }
    async setVerify(usr, id, request) {
        return this.adminService.verifyUser(id, request, usr);
    }
    async deleteUrs(id, request) {
        return this.adminService.deleteUser(id, request);
    }
    async deleteOrd(id, request) {
        return this.adminService.deleteOrder(id, request);
    }
    async setBan(id, request) {
        return this.adminService.banUser(id, request);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create Admin (only "superadmin" role)' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: admin_model_1.Admin }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Post)('/'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.CreateAdminDto, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get all admins (only "superadmin" and "admin" role)',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: admin_model_1.Admin }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Get)('/find'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "findAdmins", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Get admin by ID (only "superadmin" and "admin" role)',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: admin_model_1.Admin }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Get)('/find/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "findAdminId", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Login Admin' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: admin_model_1.Admin }),
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_admin_dto_1.CreateAdminDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "login", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Logout Admin' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: admin_model_1.Admin }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "logout", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Refresh Access Token' }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Patch)('refresh'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "refresh", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find by ID and update all rows in User (only "admin" or "moderator" role)',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: users_model_1.User }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.HttpCode)(200),
    (0, common_1.Put)('/find-by-id/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "find", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Verify User enum: [new, aprove, rejected]',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, type: users_model_1.User }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Patch)('/verify/:Id'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('Id')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_user_dto_1.VerifyUserDto, String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "setVerify", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delet User' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: users_model_1.User }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Delete)('/user/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteUrs", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delet Order' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: order_model_1.Orders }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Delete)('/order/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteOrd", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Set ban user' }),
    (0, swagger_1.ApiResponse)({ status: 200, type: users_model_1.User }),
    (0, swagger_1.ApiBearerAuth)('BearerAuthMethod'),
    (0, common_1.Patch)('/ban/:Id'),
    __param(0, (0, common_1.Param)('Id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "setBan", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map