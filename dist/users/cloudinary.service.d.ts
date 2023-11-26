/// <reference types="multer" />
import { User } from './users.model';
export declare class CloudinaryService {
    private readonly cloudinaryConfig;
    constructor();
    uploadImages(user: User, images: Express.Multer.File[]): Promise<void>;
    private uploadImage;
}
