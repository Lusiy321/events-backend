import { verify } from 'src/users/dto/verify.user.dto';
export declare class UpdateUserAdmDto {
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
    readonly master_photo: string;
    readonly photo: Array<object>;
    readonly video: Array<string>;
    readonly category: Array<string>;
    readonly price: string;
    readonly paid: boolean;
    readonly isOnline: boolean;
    readonly trial: boolean;
    readonly verify: verify;
    readonly ban: boolean;
}
