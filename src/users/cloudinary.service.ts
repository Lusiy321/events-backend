import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { createReadStream } from 'fs';
import { User } from './users.model';

@Injectable()
export class CloudinaryService {
  private readonly cloudinaryConfig: any;

  constructor() {
    this.cloudinaryConfig = {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    };
  }

  async uploadImages(user: User, images: Express.Multer.File[]): Promise<void> {
    const validImages = images.filter((image) => image);
    const uploadPromises = validImages.map((image) =>
      this.uploadImage(user, image),
    );
    await Promise.all(uploadPromises);
  }

  private async uploadImage(
    user: User,
    image: Express.Multer.File,
  ): Promise<void> {
    if (!image || !image.path) {
      console.error('Invalid image:', image);
      return;
    }

    const stream = createReadStream(image.path);

    return new Promise((resolve, reject) => {
      const cloudinaryStream = cloudinary.uploader.upload_stream(
        {
          folder: `user-${user.id}`,
          public_id: image.filename,
          ...this.cloudinaryConfig,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            user.photos.push({
              publicId: result.public_id,
              url: result.secure_url,
            });
            resolve();
          }
        },
      );

      stream.pipe(cloudinaryStream);
    });
  }
}
