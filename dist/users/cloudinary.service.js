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
const fs = require("fs");
const path = require("path");
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
                        user.photo.push(url);
                        await this.userModel.findByIdAndUpdate({ _id: user.id }, {
                            $set: {
                                photo: user.photo,
                                master_photo: user.photo[0],
                                metaUrl: user.photo[0].url,
                            },
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
    async deleteImage(user, photoId) {
        return new Promise(async (resolve, reject) => {
            try {
                cloudinary_1.v2.uploader.destroy(photoId, Object.assign({}, this.cloudinaryConfig), async (error, result) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        const updatedPhotos = user.photo.filter((item) => item.publicId !== photoId);
                        if (updatedPhotos.length === 0) {
                            await this.userModel.findByIdAndUpdate({ _id: user.id }, {
                                $set: {
                                    master_photo: {
                                        publicId: '1',
                                        url: process.env.MASTER,
                                    },
                                    metaUrl: process.env.MASTER,
                                },
                            });
                        }
                        else {
                            await this.userModel.findByIdAndUpdate({ _id: user.id }, {
                                $set: {
                                    photo: updatedPhotos,
                                    master_photo: updatedPhotos[0],
                                    metaUrl: updatedPhotos[0].url,
                                },
                            });
                        }
                        resolve();
                    }
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
    async uploadAvatar(user, image) {
        const validImages = image.filter((image) => image && image.path);
        const uploadPromises = validImages.map((image) => this.uploadAvatarImage(user, image));
        await Promise.all(uploadPromises);
    }
    async uploadAvatarImage(user, image) {
        if (!image || !image.path) {
            console.error('Invalid image:', image);
            return;
        }
        const stream = (0, fs_1.createReadStream)(image.path);
        return new Promise(async (resolve, reject) => {
            try {
                if (user.avatar.publicId !== '1') {
                    await this.deleteAvatarImage(user);
                    const cloudinaryStream = cloudinary_1.v2.uploader.upload_stream(Object.assign({ folder: `user-${user.id}`, public_id: `avatar-${image.filename}` }, this.cloudinaryConfig), async (error, result) => {
                        if (error) {
                            reject(error);
                        }
                        else {
                            const url = {
                                publicId: result.public_id,
                                url: result.secure_url,
                            };
                            await this.userModel.findByIdAndUpdate({ _id: user.id }, {
                                $set: { avatar: url },
                            });
                            resolve();
                        }
                    });
                    stream.pipe(cloudinaryStream);
                }
                else {
                    const cloudinaryStream = cloudinary_1.v2.uploader.upload_stream(Object.assign({ folder: `user-${user.id}`, public_id: `avatar-${image.filename}` }, this.cloudinaryConfig), async (error, result) => {
                        if (error) {
                            reject(error);
                        }
                        else {
                            const url = {
                                publicId: result.public_id,
                                url: result.secure_url,
                            };
                            await this.userModel.findByIdAndUpdate({ _id: user.id }, {
                                $set: { avatar: url },
                            });
                            resolve();
                        }
                    });
                    stream.pipe(cloudinaryStream);
                }
            }
            catch (error) {
                reject(error);
            }
        });
    }
    async deleteAvatarImage(user) {
        return new Promise(async (resolve, reject) => {
            try {
                cloudinary_1.v2.uploader.destroy(user.avatar.publicId, Object.assign({}, this.cloudinaryConfig), async (error, result) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        await this.userModel.findByIdAndUpdate({ _id: user.id }, {
                            $set: {
                                avatar: process.env.AVATAR,
                            },
                        });
                        resolve();
                    }
                });
            }
            catch (error) {
                reject(error);
            }
        });
    }
    async deleteFilesInUploadsFolder() {
        const uploadsFolderPath = path.join(__dirname, 'uploads');
        try {
            const files = fs.readdirSync(uploadsFolderPath);
            files.forEach((file) => {
                const filePath = path.join(uploadsFolderPath, file);
                fs.unlinkSync(filePath);
            });
        }
        catch (error) {
            console.error('Error deleting files:', error.message);
            throw error;
        }
    }
};
exports.CloudinaryService = CloudinaryService;
exports.CloudinaryService = CloudinaryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(users_model_1.User.name)),
    __metadata("design:paramtypes", [users_model_1.User])
], CloudinaryService);
//# sourceMappingURL=cloudinary.service.js.map