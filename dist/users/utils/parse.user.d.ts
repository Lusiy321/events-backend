import { UpdateUserDto } from '../dto/update.user.dto';
export declare function mergeAndRemoveDuplicates(...arrays: any[]): Promise<any[]>;
export declare function paginateArray(array: UpdateUserDto[], page: any): Promise<UpdateUserDto[]>;
export declare function shuffleArray(array: any[]): Promise<any[]>;
export declare const rows = "firstName email title description phone telegram viber whatsapp location master_photo avatar video photo category isOnline price verify social";
