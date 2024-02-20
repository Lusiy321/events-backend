"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationUsers = void 0;
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const create_user_dto_1 = require("../users/dto/create.user.dto");
let ValidationUsers = class ValidationUsers {
    async use(req, res, next) {
        const dtoInstance = (0, class_transformer_1.plainToClass)(create_user_dto_1.CreateUserDto, req.body);
        const errors = await (0, class_validator_1.validate)(dtoInstance);
        if (errors.length > 0) {
            const errorMessages = errors.map((error) => {
                return {
                    property: error.property,
                    constraints: error.constraints,
                };
            });
            return res.status(400).json({
                message: 'Validation failed',
                errors: errorMessages,
            });
        }
        next();
    }
};
exports.ValidationUsers = ValidationUsers;
exports.ValidationUsers = ValidationUsers = __decorate([
    (0, common_1.Injectable)()
], ValidationUsers);
//# sourceMappingURL=validation.users.js.map