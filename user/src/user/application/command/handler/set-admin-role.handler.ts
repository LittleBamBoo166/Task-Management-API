import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SetAdminRoleCommand } from '../impl/set-admin-role.command';
import { Ok, Err, Result } from 'oxide.ts';
import { IdResponse } from 'src/user/interface/dto/id.response';
import { Inject } from '@nestjs/common';
import { InjectionToken } from '../../injection.token';
import { UserRepositoryPort } from 'src/user/domain/database/user.repostiory.port';
import { UserNotFoundError } from 'src/user/domain/error/user.error';
import { Checking } from 'src/libs/checking';

@CommandHandler(SetAdminRoleCommand)
export class SetAdminRoleHandler
  implements
    ICommandHandler<SetAdminRoleCommand, Result<IdResponse, UserNotFoundError>>
{
  constructor(
    @Inject(InjectionToken.USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(
    command: SetAdminRoleCommand,
  ): Promise<Result<IdResponse, any>> {
    const user = await this.userRepository.getOneById(command.requesterId);
    if (Checking.isEmpty(user)) {
      return Err(new UserNotFoundError());
    }
    user.setAdminRole();
    await this.userRepository.save(user);
    return Ok(new IdResponse(command.requesterId));
  }
}
