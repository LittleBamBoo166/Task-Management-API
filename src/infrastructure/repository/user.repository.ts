import { Inject } from '@nestjs/common';
import { UserRepositoryPort } from 'src/modules/user/domain/database/user.repository.port';
import { UserModel } from 'src/modules/user/domain/model/user.model';
import { UserFactory } from 'src/modules/user/domain/user.factory';
import { getRepository } from 'typeorm';
import { User } from '../entity/user.orm-entity';

export class UserRepositoryAdapter implements UserRepositoryPort {
  constructor(@Inject(UserFactory) private readonly userFactory: UserFactory) {}

  async getOneWithRefreshToken(id: string): Promise<UserModel | null> {
    const userRepository = getRepository(User);
    const user = await userRepository
      .createQueryBuilder('user')
      .select('user', 'user')
      .addSelect('user.refreshToken')
      .where('user.id = :id', { id: id })
      .getOne();
    return this.ormToModel(user);
  }

  async getOneById(id: string): Promise<UserModel | null> {
    const userRepository = getRepository(User);
    const user = await userRepository.findOneBy({ id: id });
    return this.ormToModel(user);
  }

  async getOneByEmail(email: string): Promise<UserModel | null> {
    const userRepository = getRepository(User);
    const user = await userRepository
      .createQueryBuilder('user')
      .select('user', 'user')
      .addSelect('user.password')
      .addSelect('user.refreshToken')
      .where('user.email = :email', { email: email })
      .getOne();
    return this.ormToModel(user);
  }

  async exists(email: string): Promise<boolean> {
    const userRepository = getRepository(User);
    const users = await userRepository.findBy({ email: email });
    if (users.length === 0 || !users.length) {
      return false;
    }
    return true;
  }

  async save(user: UserModel): Promise<User> {
    const userRepository = getRepository(User);
    const result = await userRepository.save(user.getProperties());
    return result;
  }

  async getMany(): Promise<UserModel[]> {
    const userRepository = getRepository(User);
    const users = await userRepository.find();
    return users.map((user) => this.ormToModel(user));
  }

  private ormToModel(ormEntity: User): UserModel | null {
    if (!ormEntity) {
      return null;
    }
    return this.userFactory.reconstitute({
      ...ormEntity,
    });
  }
}
