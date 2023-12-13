import { Strategy, Profile } from 'passport-google-oauth20';
import { UsersService } from '../users.service';
declare const GoogleStrategy_base: new (...args: any[]) => Strategy;
export declare class GoogleStrategy extends GoogleStrategy_base {
    private readonly userService;
    constructor(userService: UsersService);
    validate(accessToken: string, refreshToken: string, profile: Profile): Promise<any>;
}
export {};
