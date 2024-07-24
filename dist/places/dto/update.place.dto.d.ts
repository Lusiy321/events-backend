import { Photo, Social } from '../../users/utils/user.types';
import { Place } from '../places.model';
export declare class UpdatePlaceDto {
    readonly placeName: string;
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
    readonly verify: string;
    readonly ban: boolean;
    readonly register: boolean;
}
export declare class search_place {
    totalPages: number;
    currentPage: number;
    data: Place[];
}
