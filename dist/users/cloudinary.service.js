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
exports.CloudinaryService = void 0;
const common_1 = require("@nestjs/common");
const cloudinary_1 = require("cloudinary");
const fs_1 = require("fs");
let CloudinaryService = class CloudinaryService {
    constructor() {
        this.cloudinaryConfig = {
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        };
    }
    async uploadImages(user, images) {
        const validImages = images.filter((image) => image);
        const uploadPromises = validImages.map((image) => this.uploadImage(user, image));
        await Promise.all(uploadPromises);
    }
    async uploadImage(user, image) {
        if (!image || !image.path) {
            console.error('Invalid image:', image);
            return;
        }
        const stream = (0, fs_1.createReadStream)(image.path);
        return new Promise((resolve, reject) => {
            const cloudinaryStream = cloudinary_1.v2.uploader.upload_stream(Object.assign({ folder: `user-${user.id}`, public_id: image.filename }, this.cloudinaryConfig), (error, result) => {
                if (error) {
                    reject(error);
                }
                else {
                    user.photos.push({
                        publicId: result.public_id,
                        url: result.secure_url,
                    });
                    resolve();
                }
            });
            stream.pipe(cloudinaryStream);
        });
    }
};
exports.CloudinaryService = CloudinaryService;
exports.CloudinaryService = CloudinaryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], CloudinaryService);
//# sourceMappingURL=cloudinary.service.js.map