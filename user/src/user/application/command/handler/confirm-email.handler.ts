import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { Result, Err, Ok } from 'oxide.ts';
import { Checking } from 'src/libs/checking';
import { UserRepositoryPort } from 'src/user/domain/database/user.repostiory.port';
import { ConfirmEmailFailedError } from 'src/user/domain/error/user.error';
import { IdResponse } from 'src/user/interface/dto/id.response';
import { InjectionToken } from '../../injection.token';
import { ConfirmEmailCommand } from '../impl/confirm-email.command';

@CommandHandler(ConfirmEmailCommand)
export class ConfirmEmailHandler
  implements
    ICommandHandler<
      ConfirmEmailCommand,
      Result<IdResponse, ConfirmEmailFailedError>
    >
{
  constructor(
    @Inject(InjectionToken.USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    private readonly jwtService: JwtService,
  ) {}

  async execute(
    command: ConfirmEmailCommand,
  ): Promise<Result<IdResponse, ConfirmEmailFailedError>> {
    const payload = await this.jwtService.verify(command.token);
    if (typeof payload === 'object' && 'id' in payload) {
      const id = payload.id;
      const user = await this.userRepository.getOneById(id);
      if (Checking.isEmpty(user)) {
        return Err(new ConfirmEmailFailedError());
      }
      if (!user.isComfirmed) {
        user.isComfirmed = true;
        await this.userRepository.save(user);
      }
      return Ok(new IdResponse(id));
    }
  }
}
