import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepositoryPort } from 'src/modules/user/domain/database/user.repository.port';
import { InjectionToken } from '../../injection.token';
import { CreateUserCommand } from '../impl/create-user.command';
import { UserAlreadyExistError } from 'src/modules/user/domain/error/user.error';
import { Result, Err, Ok } from 'oxide.ts';
import { IdResponse } from 'src/libs/dto/id.response.dto';
import { UserFactory } from 'src/modules/user/domain/user.factory';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler
  implements
    ICommandHandler<
      CreateUserCommand,
      Result<IdResponse, UserAlreadyExistError>
    >
{
  constructor(
    @Inject(InjectionToken.USER_REPOSITORY)
    private userRepository: UserRepositoryPort,
    private readonly userFactory: UserFactory,
  ) {}

  async execute(
    command: CreateUserCommand,
  ): Promise<Result<IdResponse, UserAlreadyExistError>> {
    const hasUsers = await this.userRepository.exists(
      command.email.toLowerCase(),
    );
    if (hasUsers) {
      return Err(new UserAlreadyExistError());
    } else {
      const user = this.userFactory.create(command.name, command.email);
      user.setPassword(command.password);
      await this.userRepository.save(user);
      return Ok(new IdResponse(user.id));
    }
  }
}
