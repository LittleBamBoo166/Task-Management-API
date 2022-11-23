import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from '../impl/update-user.command';
import { Result, Err, Ok } from 'oxide.ts';
import { IdResponse } from 'src/libs/dto/id.response.dto';
import { Inject } from '@nestjs/common';
import { InjectionToken } from '../../injection.token';
import { UserRepositoryPort } from 'src/modules/user/domain/database/user.repository.port';
import { AccessDeniedError } from 'src/modules/user/domain/error/user.error';
import { Checking } from 'src/libs/util/checking';
import { ArgumentNotProvideException } from 'src/libs/exception/argument-not-provide.exception';

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
      user.edit({ ...command });
      await this.userRepository.save(user);
      const response = new IdResponse(command.userId);
      return Ok(response);
    } else {
      return Err(new AccessDeniedError());
    }
  }
}
