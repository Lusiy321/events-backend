import { Photo } from '../users.model';
import { Categories } from './caterory.interface';
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
    readonly video: Photo[];
    readonly category: Categories[];
    readonly price: string;
}
