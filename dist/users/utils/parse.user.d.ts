import { User } from 'src/users/users.model';
import { UpdateUserDto } from '../dto/update.user.dto';
export declare function parseUser(user: User): Promise<any>;
export declare function mergeAndRemoveDuplicates(...arrays: any[]): any[];
export declare function paginateArray(array: UpdateUserDto[], page: any): UpdateUserDto[];
export declare const rows = "firstName email title description phone telegram whatsapp location master_photo avatar video photo category isOnline price verify";
