import { Inject, Injectable } from '@nestjs/common';
import {
  ConflictException,
  NotFoundException,
} from '@nestjs/common/exceptions';
import { PassportStrategy } from '@nestjs/passport';
import { compareSync } from 'bcrypt';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class RefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Refresh;
        },
      ]),
      secretOrKey: process.env.REFRESH_SECRECT,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const refreshToken = req?.cookies?.Refresh;
    const user = await this.authService.getUserWithRefreshToken(payload.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // console.log(user);
    const isRefreshTokenEqual = compareSync(refreshToken, user.refreshToken);
    if (isRefreshTokenEqual) {
      return user;
    } else {
      throw new ConflictException('Refresh token not match');
    }
  }
}
