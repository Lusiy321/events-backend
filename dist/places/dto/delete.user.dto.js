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
exports.DelUserMediaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class DelUserMediaDto {
}
exports.DelUserMediaDto = DelUserMediaDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'user-64ff012f1424c2d37e2d0467/6D47C938-D9A3-49CA-A9F3-35E84083DCDB_1_201_a-1701253649865.jpeg',
        description: 'Delete object',
    }),
    __metadata("design:type", String)
], DelUserMediaDto.prototype, "id", void 0);
//# sourceMappingURL=delete.user.dto.js.map