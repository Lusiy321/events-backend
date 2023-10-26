import { User } from 'src/users/users.model';
export declare function refreshAccessToken(req: any): Promise<User>;
export declare function findToken(req: any): Promise<User>;
export declare function createToken(authUser: {
    _id: string;
}): Promise<any>;
