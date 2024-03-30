import { Photo } from '../utils/user.types';
export declare class GoogleUserDto {
    readonly firstName: string;
    readonly email: string;
    readonly password: string;
    readonly googleId: string;
    readonly avatar: Photo;
}
