import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { UsersService } from '../users.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private readonly userService: UsersService) {
    super({
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ['email', 'profile'],
      graphAPIVersion: 'v18.00',
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    console.log(profile);
    const user = await this.userService.validateFacebook({
      email: 'vasya@gmail.com',
      password: profile.id,
      firstName: profile._json.first_name,
      facebookId: profile.id,
      // avatar: {
      //   publicId: '1',
      //   url: profile._json.picture,
      // },
    });
    await user.save();
    return user || null;
  }
}
