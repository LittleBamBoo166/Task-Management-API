import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserQuery } from '../impl/get-user-by-id.query';
import { Err, Ok, Result } from 'oxide.ts';
import { UserResponse } from 'src/modules/user/interface/dto/user.response';
import { UserNotFoundError } from 'src/modules/user/domain/error/user.error';
import { Inject } from '@nestjs/common';
import { InjectionToken } from '../../injection.token';
import { UserRepositoryPort } from 'src/modules/user/domain/database/user.repository.port';
import { Checking } from 'src/libs/util/checking';

@QueryHandler(GetUserQuery)
export class GetUserHandler
  implements
    IQueryHandler<GetUserQuery, Result<UserResponse, UserNotFoundError>>
{
  constructor(
    @Inject(InjectionToken.USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(
    query: GetUserQuery,
  ): Promise<Result<UserResponse, UserNotFoundError>> {
    const user = await this.userRepository.getOneById(query.id);
    if (Checking.isEmpty(user)) {
      return Err(new UserNotFoundError());
    }
    const userProperties = user.getProperties();
    const response = new UserResponse(
      userProperties.id,
      userProperties.name,
      userProperties.email,
    );
    return Ok(response);
  }
}
