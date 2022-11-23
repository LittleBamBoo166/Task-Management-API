import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from '../impl/update-user.command';
import { Result, Err, Ok } from 'oxide.ts';
import { Inject } from '@nestjs/common';
import { InjectionToken } from '../../injection.token';
import { IdResponse } from 'src/user/interface/dto/id.response';
import { AccessDeniedError } from 'src/user/domain/error/user.error';
import { ArgumentNotProvideException } from 'src/libs/argument-not-provide.exception';
import { UserRepositoryPort } from 'src/user/domain/database/user.repostiory.port';
import { Checking } from 'src/libs/checking';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler
  implements
    ICommandHandler<
      UpdateUserCommand,
      Result<IdResponse, AccessDeniedError | ArgumentNotProvideException>
    >
{
  constructor(
    @Inject(InjectionToken.USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(
    command: UpdateUserCommand,
  ): Promise<
    Result<IdResponse, AccessDeniedError | ArgumentNotProvideException>
  > {
    const isValidRequester = command.userId === command.requestedId;
    if (isValidRequester) {
      if (
        Checking.isEmpty(command.name) &&
        Checking.isEmpty(command.password)
      ) {
        return Err(new ArgumentNotProvideException());
      }
      const user = await this.userRepository.getOneById(command.userId);
      if (!Checking.isEmpty(command.password) && !user.isComfirmed) {
        return Err(new AccessDeniedError());
      }
      user.edit({ ...command });
      await this.userRepository.save(user);
      const response = new IdResponse(command.userId);
      return Ok(response);
    } else {
      return Err(new AccessDeniedError());
    }
  }
}
