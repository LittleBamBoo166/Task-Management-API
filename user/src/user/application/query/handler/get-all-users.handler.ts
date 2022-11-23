import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Err, Ok, Result } from 'oxide.ts';
import { Inject } from '@nestjs/common';
import { InjectionToken } from '../../injection.token';
import { GetAllUsersQuery } from '../impl/get-all-users.query';
import { UserResponse } from 'src/user/interface/dto/user.response';
import { UserNotFoundError } from 'src/user/domain/error/user.error';
import { UserRepositoryPort } from 'src/user/domain/database/user.repostiory.port';
import { Checking } from 'src/libs/checking';

@QueryHandler(GetAllUsersQuery)
export class GetAllUsersHandler
  implements
    IQueryHandler<GetAllUsersQuery, Result<UserResponse[], UserNotFoundError>>
{
  constructor(
    @Inject(InjectionToken.USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(): Promise<Result<UserResponse[], UserNotFoundError>> {
    const users = await this.userRepository.getMany();
    const hasUsers = !Checking.isEmpty(users);
    if (hasUsers) {
      const userResponses = users.map((user) => {
        const userProperties = user.getProperties();
        return new UserResponse(
          userProperties.id,
          userProperties.name,
          userProperties.email,
          userProperties.role,
        );
      });
      return Ok(userResponses);
    } else {
      return Err(new UserNotFoundError());
    }
  }
}
