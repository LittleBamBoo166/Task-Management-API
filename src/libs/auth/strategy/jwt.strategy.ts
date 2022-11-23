import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Checking } from 'src/libs/util/checking';
import { InjectionToken } from 'src/modules/user/application/injection.token';
import { UserRepositoryPort } from 'src/modules/user/domain/database/user.repository.port';
import { JwtConstants } from '../jwt-constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(InjectionToken.USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: JwtConstants.secrect,
    });
  }

  async validate(payload: any) {
    const user = await this.userRepository.getOneById(payload.userId);
    if (Checking.isEmpty(user)) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
