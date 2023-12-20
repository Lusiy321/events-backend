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
exports.FacebookStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_facebook_1 = require("passport-facebook");
const users_service_1 = require("../users.service");
let FacebookStrategy = class FacebookStrategy extends (0, passport_1.PassportStrategy)(passport_facebook_1.Strategy, 'facebook') {
    constructor(userService) {
        super({
            clientID: process.env.FACEBOOK_ID,
            clientSecret: process.env.FACEBOOK_SECRET,
            callbackURL: process.env.FACEBOOK_CALLBACK_URL,
            scope: ['email', 'public_profile'],
            profileURL: 'https://graph.facebook.com/v18.0/me?fields=id%2Cname%2Cemail%2Cpicture%7Burl%7D&access_token=EAAETFobaGvcBO5FWbHJYQIm5uEfxxlKdwROrrEUWVv90SOEtsqFPFU3l9uaZA2WZAFRLJtvtZCyuEAxonXS0HFUlACeES8uQ66ls3EcXKVUicc5j2I3xMS4PvcWz549Czi3QiWEw77IvCT8HGq7jxs5cxbiZBEYmTyHQbDpZAZAO2n61UcSKDZA6aU1T4TMQ51pCgZBVVC3bnizKlu7R1zT2M2yg83x2AygCrFdYnTdsR6oZD',
        });
        this.userService = userService;
    }
    async validate(accessToken, refreshToken, profile) {
        const user = await this.userService.validateFacebook({
            email: profile._json.email,
            password: accessToken,
            firstName: profile._json.name,
            facebookId: profile.id,
            avatar: {
                publicId: '1',
                url: profile._json.picture.data.url,
            },
        });
        return user || null;
    }
};
exports.FacebookStrategy = FacebookStrategy;
exports.FacebookStrategy = FacebookStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], FacebookStrategy);
//# sourceMappingURL=FacebookStrategy.js.map