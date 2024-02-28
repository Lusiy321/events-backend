import { Photo, Social } from '../users.model';
import { verify } from './verify.user.dto';
export declare class UpdateUserDto {
    readonly firstName: string;
    readonly title: string;
    readonly description: string;
    readonly phone: string;
    readonly telegram: string;
    readonly viber: string;
    readonly whatsapp: string;
    readonly location: string;
    readonly master_photo: Photo;
    readonly avatar: Photo;
    readonly video: Photo[];
    readonly photo: Photo[];
    readonly social: Social;
    readonly isOnline: boolean;
    readonly price: string;
    readonly paid: boolean;
    readonly trial: boolean;
    readonly verify: verify;
    readonly ban: boolean;
    readonly register: boolean;
}
export interface search_result {
    totalPages: number;
    currentPage: number;
    data: UpdateUserDto[];
}
