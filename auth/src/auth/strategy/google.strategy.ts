import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
// import { config } from 'dotenv';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

// config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: 'http://localhost:4002/google/redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails } = profile;
    const user = {
      name: `${name.givenName} ${name.familyName}`,
      email: emails[0].value,
      accessToken,
      refreshToken,
    };
    done(null, user);
  }
}
