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
      profileFields: [
        'id',
        'email',
        'name',
        'displayName',
        'picture.type(large)',
      ],
      tokenURL: `https://graph.facebook.com/v18.0/oauth/access_token=EAAETFobaGvcBO5FWbHJYQIm5uEfxxlKdwROrrEUWVv90SOEtsqFPFU3l9uaZA2WZAFRLJtvtZCyuEAxonXS0HFUlACeES8uQ66ls3EcXKVUicc5j2I3xMS4PvcWz549Czi3QiWEw77IvCT8HGq7jxs5cxbiZBEYmTyHQbDpZAZAO2n61UcSKDZA6aU1T4TMQ51pCgZBVVC3bnizKlu7R1zT2M2yg83x2AygCrFdYnTdsR6oZD`,
      profileURL:
        'https://graph.facebook.com/v18.0/me?fields=id%2Cname%2Cemail%2Cpicture%7Burl%7D&access_token=EAAETFobaGvcBO5FWbHJYQIm5uEfxxlKdwROrrEUWVv90SOEtsqFPFU3l9uaZA2WZAFRLJtvtZCyuEAxonXS0HFUlACeES8uQ66ls3EcXKVUicc5j2I3xMS4PvcWz549Czi3QiWEw77IvCT8HGq7jxs5cxbiZBEYmTyHQbDpZAZAO2n61UcSKDZA6aU1T4TMQ51pCgZBVVC3bnizKlu7R1zT2M2yg83x2AygCrFdYnTdsR6oZD',
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
