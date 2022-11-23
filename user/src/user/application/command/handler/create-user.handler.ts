import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectionToken } from '../../injection.token';
import { CreateUserCommand } from '../impl/create-user.command';
import { Result, Err, Ok } from 'oxide.ts';
import { IdResponse } from 'src/user/interface/dto/id.response';
import { UserAlreadyExistError } from 'src/user/domain/error/user.error';
import { UserFactory } from 'src/user/domain/user.factory';
import { UserRepositoryPort } from 'src/user/domain/database/user.repostiory.port';
import { UserService } from '../../user.service';

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
    private readonly userService: UserService,
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
      if (command.password) {
        user.setPassword(command.password);
      }
      await this.userRepository.save(user);
      await this.userService.sendVerificationLink(user.id);
      return Ok(new IdResponse(user.id));
    }
  }
}
