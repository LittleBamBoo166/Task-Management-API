import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUsersQuery } from '../impl/get-users.query';
import { Err, Ok, Result } from 'oxide.ts';
import { UserResponse } from 'src/modules/user/interface/dto/user.response';
import { Inject } from '@nestjs/common';
import { InjectionToken } from '../../injection.token';
import { UserRepositoryPort } from 'src/modules/user/domain/database/user.repository.port';
import { UserNotFoundError } from 'src/modules/user/domain/error/user.error';
import { Checking } from 'src/libs/util/checking';

@QueryHandler(GetUsersQuery)
export class GetAllUsersHandler
  implements
    IQueryHandler<GetUsersQuery, Result<UserResponse[], UserNotFoundError>>
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
        );
      });
      return Ok(userResponses);
    } else {
      return Err(new UserNotFoundError());
    }
  }
}
