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
      profileURL: `https://graph.facebook.com/v18.0/me?fields=id,name,email,picture&access_token=EAAETFobaGvcBO01ATm2NQYzKtBCgZB5tZAvXmodHoZAVIlZALGSRnBXjZAgbTWjmarEMB6Gu0zcwzkvF49MxXA4IZA09BlM4PZCfygbhBmSrvmPzuaXWCU7151h1h5Cl7qguXrAFrioSDV72TqkZC2KFgxotGEl21yuMZAsOac2qD3Ii5ZC5aWsCrZAgHjJZAuH3ipy9IGLQx9KwQZCmKrYfHQz07yT75ZCRVwLUx7BzZCr5cApj4GfyYyK9nBActpOJzq5SObzLrNXucYVaMMZD`,
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
