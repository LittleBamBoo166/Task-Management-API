import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { UserRepositoryPort } from 'src/modules/user/domain/database/user.repository.port';
import { InjectionToken } from '../../injection.token';
import { LoginCommand } from '../impl/login.command';
import { Err, Ok, Result } from 'oxide.ts';
import { LoginResponse } from 'src/modules/user/interface/dto/login.response';
import {
  IncorrectPasswordError,
  UserNotFoundError,
} from 'src/modules/user/domain/error/user.error';
import { JwtConstants } from 'src/libs/auth/jwt-constants';
import { Checking } from 'src/libs/util/checking';

@CommandHandler(LoginCommand)
export class LoginHandler
  implements
    ICommandHandler<
      LoginCommand,
      Result<LoginResponse, UserNotFoundError | IncorrectPasswordError>
    >
{
  constructor(
    private jwtService: JwtService,
    @Inject(InjectionToken.USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(
    command: LoginCommand,
  ): Promise<Result<LoginResponse, UserNotFoundError>> {
    const user = await this.userRepository.getOneByEmail(command.email);
    if (Checking.isEmpty(user)) {
      return Err(new UserNotFoundError());
    }

    // get token
    const userId = user.id;
    const payload = { userId };
    const token = this.jwtService.sign(payload);
    // get refresh token
    const refreshToken = this.jwtService.sign(payload, {
      secret: JwtConstants.refreshTokenSecrect,
      expiresIn: JwtConstants.refreshTokenExpiredIn,
    });

    user.setRefreshToken(refreshToken);
    await this.userRepository.save(user);
    const response = new LoginResponse(user.id, token, refreshToken);
    return Ok(response);
  }
}
