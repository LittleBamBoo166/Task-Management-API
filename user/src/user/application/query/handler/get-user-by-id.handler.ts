import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserByIdQuery } from '../impl/get-user-by-id.query';
import { Err, Ok, Result } from 'oxide.ts';
import { Inject } from '@nestjs/common';
import { InjectionToken } from '../../injection.token';
import { UserResponse } from 'src/user/interface/dto/user.response';
import { UserNotFoundError } from 'src/user/domain/error/user.error';
import { UserRepositoryPort } from 'src/user/domain/database/user.repostiory.port';
import { Checking } from 'src/libs/checking';

@QueryHandler(GetUserByIdQuery)
export class GetUserHandler
  implements
    IQueryHandler<GetUserByIdQuery, Result<UserResponse, UserNotFoundError>>
{
  constructor(
    @Inject(InjectionToken.USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(
    query: GetUserByIdQuery,
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
      userProperties.role,
    );
    return Ok(response);
  }
}
