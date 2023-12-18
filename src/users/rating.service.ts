import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './users.model';

@Injectable()
export class RatingService {
  constructor(
    @InjectModel(User.name)
    private userModel: User,
  ) {}

  async addRating(id: string, rating: number) {
    try {
      const user: User = await this.userModel.findById(id);
      if (rating >= 1 && rating <= 5) {
        user.totalRating += rating;
        user.numberOfRatings++;
        await this.userModel.findByIdAndUpdate(
          { _id: id },
          {
            totalRating: user.totalRating,
            numberOfRatings: user.numberOfRatings,
          },
        );
        return this.calculateAverageRating(id);
      } else {
        throw new Error('Rating must be between 1 and 5');
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  async calculateAverageRating(id: string) {
    const user: User = await this.userModel.findById(id);
    if (user.numberOfRatings === 0) {
      return 0;
    }

    return user.totalRating / user.numberOfRatings;
  }
}
