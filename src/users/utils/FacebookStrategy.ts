import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { UsersService } from '../users.service';
import axios from 'axios';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private readonly userService: UsersService) {
    super({
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      scope: ['email', 'public_profile'],
      profileURL:
        'https://graph.facebook.com/v18.0/me?fields=id%2Cname%2Cemail%2Cpicture%7Burl%7D&access_token=EAAETFobaGvcBO5FWbHJYQIm5uEfxxlKdwROrrEUWVv90SOEtsqFPFU3l9uaZA2WZAFRLJtvtZCyuEAxonXS0HFUlACeES8uQ66ls3EcXKVUicc5j2I3xMS4PvcWz549Czi3QiWEw77IvCT8HGq7jxs5cxbiZBEYmTyHQbDpZAZAO2n61UcSKDZA6aU1T4TMQ51pCgZBVVC3bnizKlu7R1zT2M2yg83x2AygCrFdYnTdsR6oZD',
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const user = await this.userService.validateFacebook({
      email: profile._json.email,
      password: accessToken,
      firstName: profile._json.name,
      facebookId: profile.id,
      avatar: {
        publicId: '1',
        url: profile._json.picture.data.url,
      },
    });

    return user || null;
  }
}
