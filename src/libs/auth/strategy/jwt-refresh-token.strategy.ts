import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { JwtConstants } from '../jwt-constants';
import { InjectionToken } from '../../../modules/user/application/injection.token';
import { UserRepositoryPort } from 'src/modules/user/domain/database/user.repository.port';
import { Checking } from 'src/libs/util/checking';
import * as bcrypt from 'bcrypt';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    @Inject(InjectionToken.USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Refresh;
        },
      ]),
      secretOrKey: JwtConstants.refreshTokenSecrect,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const refreshToken = req?.cookies?.Refresh;
    const user = await this.userRepository.getOneWithRefreshToken(
      payload.userId,
    );
    if (Checking.isEmpty(user)) {
      throw new NotFoundException('User not found');
    }
    const isRefreshTokenEqual = bcrypt.compareSync(
      refreshToken,
      user.getRefreshToken(),
    );
    if (isRefreshTokenEqual) {
      return user;
    } else {
      throw new ConflictException('Refresh token not match');
    }
  }
}
