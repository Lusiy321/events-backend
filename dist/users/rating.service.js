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
exports.RatingService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const users_model_1 = require("./users.model");
let RatingService = class RatingService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async addRating(id, rating) {
        try {
            const user = await this.userModel.findById(id);
            if (rating >= 1 && rating <= 5) {
                user.totalRating += rating;
                user.numberOfRatings++;
                await this.userModel.findByIdAndUpdate({ _id: id }, {
                    totalRating: user.totalRating,
                    numberOfRatings: user.numberOfRatings,
                });
                return this.calculateAverageRating(id);
            }
            else {
                throw new Error('Rating must be between 1 and 5');
            }
        }
        catch (e) {
            throw new Error(e);
        }
    }
    async calculateAverageRating(id) {
        const user = await this.userModel.findById(id);
        if (user.numberOfRatings === 0) {
            return 0;
        }
        return user.totalRating / user.numberOfRatings;
    }
};
exports.RatingService = RatingService;
exports.RatingService = RatingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(users_model_1.User.name)),
    __metadata("design:paramtypes", [users_model_1.User])
], RatingService);
//# sourceMappingURL=rating.service.js.map