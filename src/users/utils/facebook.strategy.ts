import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { UsersService } from '../users.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private readonly userService: UsersService) {
    super({
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ['id', 'emails', 'name'],
    });
  }

  async validate(accessToken: string, profile: any) {
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
