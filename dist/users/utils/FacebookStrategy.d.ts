import { Profile, Strategy } from 'passport-facebook';
import { UsersService } from '../users.service';
declare const FacebookStrategy_base: new (...args: any[]) => Strategy;
export declare class FacebookStrategy extends FacebookStrategy_base {
    private readonly userService;
    constructor(userService: UsersService);
    validate(accessToken: string, refreshToken: string, profile: Profile): Promise<any>;
}
export {};
