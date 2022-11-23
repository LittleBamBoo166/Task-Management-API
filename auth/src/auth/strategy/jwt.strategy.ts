import { Inject, Injectable } from '@nestjs/common/decorators';
import { NotFoundException } from '@nestjs/common/exceptions';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRECT,
    });
  }

  async validate(payload: any) {
    const user = await this.authService.getUserById(payload.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
