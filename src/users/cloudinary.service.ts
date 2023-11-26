import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { createReadStream } from 'fs';
import { User } from './users.model';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CloudinaryService {
  private readonly cloudinaryConfig: any;

  constructor(
    @InjectModel(User.name)
    private userModel: User,
  ) {
    this.cloudinaryConfig = {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    };
  }

  async uploadImages(user: User, images: Express.Multer.File[]): Promise<void> {
    const validImages = images.filter((image) => image && image.path);

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

    return new Promise(async (resolve, reject) => {
      try {
        const cloudinaryStream = cloudinary.uploader.upload_stream(
          {
            folder: `user-${user.id}`,
            public_id: image.filename,
            ...this.cloudinaryConfig,
          },
          async (error, result) => {
            if (error) {
              reject(error);
            } else {
              const url = {
                publicId: result.public_id,
                url: result.secure_url,
              };
              console.log(user);
              user.photo.push(url);
              user.save();
              await this.userModel.findByIdAndUpdate(
                { _id: user.id },
                {
                  $set: { photo: user.photo },
                },
              );
              resolve();
            }
          },
        );

        stream.pipe(cloudinaryStream);
      } catch (error) {
        reject(error);
      }
    });
  }
}
