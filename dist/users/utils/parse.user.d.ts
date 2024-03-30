import { User } from '../users.model';
export declare function mergeAndRemoveDuplicates(...arrays: any[]): Promise<any[]>;
export declare function paginateArray(array: User[], page: any): Promise<User[]>;
export declare function shuffleArray(array: any[]): Promise<any[]>;
export declare const rows = "firstName email title description phone telegram viber whatsapp location master_photo avatar video photo category isOnline price verify social";
