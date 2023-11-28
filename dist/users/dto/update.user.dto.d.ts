import { Photo } from '../users.model';
export declare class UpdateUserDto {
    id: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly password: string;
    readonly title: string;
    readonly description: string;
    readonly phone: string;
    readonly telegram: string;
    readonly viber: string;
    readonly whatsapp: string;
    readonly location: string;
    readonly master_photo: Photo;
    readonly avatar: Photo;
    readonly photo: Array<object>;
    readonly video: Photo;
    readonly category: Array<string>;
    readonly price: string;
}
