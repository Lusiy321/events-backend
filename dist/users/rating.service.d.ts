import { User } from './users.model';
export declare class RatingService {
    private userModel;
    constructor(userModel: User);
    addRating(id: string, rating: number): Promise<number>;
    calculateAverageRating(id: string): Promise<number>;
}
