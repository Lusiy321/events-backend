/// <reference types="multer" />
import { User } from './users.model';
export declare class CloudinaryService {
    private userModel;
    private readonly cloudinaryConfig;
    constructor(userModel: User);
    uploadImages(user: User, images: Express.Multer.File[]): Promise<void>;
    uploadImageLive(user: User, image: Express.Multer.File): Promise<void>;
    private uploadImage;
    deleteAllImages(user: User): Promise<void>;
    deleteImage(user: User, photoId: string): Promise<void>;
    uploadAvatar(user: User, image: Express.Multer.File[]): Promise<void>;
    private uploadAvatarImage;
    deleteAvatarImage(user: User): Promise<void>;
    deleteFilesInUploadsFolder(): Promise<void>;
}
