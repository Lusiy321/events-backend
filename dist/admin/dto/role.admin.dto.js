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
exports.RoleAdminDto = exports.role = void 0;
const swagger_1 = require("@nestjs/swagger");
var role;
(function (role) {
    role["superadmin"] = "superadmin";
    role["admin"] = "admin";
    role["user"] = "smm";
    role["moderator"] = "moderator";
})(role || (exports.role = role = {}));
class RoleAdminDto {
}
exports.RoleAdminDto = RoleAdminDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'moderator', description: 'admin role' }),
    __metadata("design:type", String)
], RoleAdminDto.prototype, "role", void 0);
//# sourceMappingURL=role.admin.dto.js.map