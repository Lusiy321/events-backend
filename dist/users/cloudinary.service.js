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
exports.CloudinaryService = void 0;
const common_1 = require("@nestjs/common");
const cloudinary_1 = require("cloudinary");
const fs_1 = require("fs");
const users_model_1 = require("./users.model");
const mongoose_1 = require("@nestjs/mongoose");
let CloudinaryService = class CloudinaryService {
    constructor(userModel) {
        this.userModel = userModel;
        this.cloudinaryConfig = {
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        };
    }
    async uploadImages(user, images) {
        const validImages = images.filter((image) => image && image.path);
        const uploadPromises = validImages.map((image) => this.uploadImage(user, image));
        await Promise.all(uploadPromises);
    }
    async uploadImage(user, image) {
        if (!image || !image.path) {
            console.error('Invalid image:', image);
            return;
        }
        const stream = (0, fs_1.createReadStream)(image.path);
        return new Promise(async (resolve, reject) => {
            try {
                const cloudinaryStream = cloudinary_1.v2.uploader.upload_stream(Object.assign({ folder: `user-${user.id}`, public_id: image.filename }, this.cloudinaryConfig), async (error, result) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        const url = {
                            publicId: result.public_id,
                            url: result.secure_url,
                        };
                        console.log(user);
                        user.photo.push(url);
                        user.save();
                        await this.userModel.findByIdAndUpdate({ _id: user.id }, {
                            $set: { photo: user.photo },
                        });
                        resolve();
                    }
                });
                stream.pipe(cloudinaryStream);
            }
            catch (error) {
                reject(error);
            }
        });
    }
};
exports.CloudinaryService = CloudinaryService;
exports.CloudinaryService = CloudinaryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(users_model_1.User.name)),
    __metadata("design:paramtypes", [users_model_1.User])
], CloudinaryService);
//# sourceMappingURL=cloudinary.service.js.map