import { Photo } from '../users.model';
export declare class GoogleUserDto {
    readonly firstName: string;
    readonly email: string;
    readonly password: string;
    readonly googleId: string;
    readonly avatar: Photo;
}
