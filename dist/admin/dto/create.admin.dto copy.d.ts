import { role } from './role.admin.dto';
export declare class CreateAdminDto {
    toLowerCase(): {
        username: string;
    };
    readonly username: string;
    readonly password: string;
    readonly role: role;
}
