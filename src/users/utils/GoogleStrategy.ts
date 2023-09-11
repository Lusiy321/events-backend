/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { UsersService } from '../users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly userService: UsersService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, profile: Profile) {
    const user = await this.userService.validateUser({
      email: profile.emails[0].value,
      password: profile.id + accessToken,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      master_photo: profile.photos[0].value,
      googleId: profile.id,
      verify: profile.emails[0].verified,
    });
    user.save();
    return user || null;
  }
}
