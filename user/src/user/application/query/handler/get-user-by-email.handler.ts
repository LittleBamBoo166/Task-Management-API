import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetUserByEmailQuery } from '../impl/get-user-by-email.query';
import { InjectionToken } from '../../injection.token';
import { UserRepositoryPort } from 'src/user/domain/database/user.repostiory.port';
import { Checking } from 'src/libs/checking';
import { User } from 'src/user/infrastructure/entity/user.orm-entity';

@QueryHandler(GetUserByEmailQuery)
export class GetUserByEmailHandler
  implements IQueryHandler<GetUserByEmailQuery, User>
{
  constructor(
    @Inject(InjectionToken.USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute(query: GetUserByEmailQuery): Promise<User> {
    const user = await this.userRepository.getOneByEmail(query.email);
    if (Checking.isEmpty(user)) {
      return null;
    } else {
      return user;
    }
  }
}
