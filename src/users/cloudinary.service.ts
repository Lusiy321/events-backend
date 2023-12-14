import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { createReadStream } from 'fs';
import { User } from './users.model';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs';
import * as path from 'path';

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
              user.photo.push(url);

              await this.userModel.findByIdAndUpdate(
                { _id: user.id },
                {
                  $set: { photo: user.photo, master_photo: user.photo[0] },
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

  async deleteImage(user: User, photoId: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        cloudinary.uploader.destroy(
          photoId,
          { ...this.cloudinaryConfig },
          async (error, result) => {
            if (error) {
              reject(error);
            } else {
              const updatedPhotos = user.photo.filter(
                (item) => item.publicId !== photoId,
              );
              if (updatedPhotos.length === 0) {
                await this.userModel.findByIdAndUpdate(
                  { _id: user.id },
                  {
                    $set: {
                      master_photo: {
                        publicId: '1',
                        url: process.env.MASTER,
                      },
                    },
                  },
                );
              } else {
                await this.userModel.findByIdAndUpdate(
                  { _id: user.id },
                  {
                    $set: {
                      photo: updatedPhotos,
                      master_photo: updatedPhotos[0],
                    },
                  },
                );
              }
              resolve();
            }
          },
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  async uploadAvatar(user: User, image: Express.Multer.File[]): Promise<void> {
    const validImages = image.filter((image) => image && image.path);

    const uploadPromises = validImages.map((image) =>
      this.uploadAvatarImage(user, image),
    );
    await Promise.all(uploadPromises);
  }

  private async uploadAvatarImage(
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
        if (user.avatar.publicId !== '1') {
          await this.deleteAvatarImage(user);
          const cloudinaryStream = cloudinary.uploader.upload_stream(
            {
              folder: `user-${user.id}`,
              public_id: `avatar-${image.filename}`,
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

                await this.userModel.findByIdAndUpdate(
                  { _id: user.id },
                  {
                    $set: { avatar: url },
                  },
                );
                resolve();
              }
            },
          );

          stream.pipe(cloudinaryStream);
        } else {
          const cloudinaryStream = cloudinary.uploader.upload_stream(
            {
              folder: `user-${user.id}`,
              public_id: `avatar-${image.filename}`,
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

                await this.userModel.findByIdAndUpdate(
                  { _id: user.id },
                  {
                    $set: { avatar: url },
                  },
                );
                resolve();
              }
            },
          );

          stream.pipe(cloudinaryStream);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  async deleteAvatarImage(user: User): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        cloudinary.uploader.destroy(
          user.avatar.publicId,
          { ...this.cloudinaryConfig },
          async (error, result) => {
            if (error) {
              reject(error);
            } else {
              await this.userModel.findByIdAndUpdate(
                { _id: user.id },
                {
                  $set: {
                    avatar: process.env.AVATAR,
                  },
                },
              );

              resolve();
            }
          },
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  async deleteFilesInUploadsFolder(): Promise<void> {
    const uploadsFolderPath = path.join(__dirname, 'uploads');

    try {
      const files = fs.readdirSync(uploadsFolderPath);

      files.forEach((file) => {
        const filePath = path.join(uploadsFolderPath, file);

        fs.unlinkSync(filePath);
      });
    } catch (error) {
      console.error('Error deleting files:', error.message);
      throw error;
    }
  }
}
