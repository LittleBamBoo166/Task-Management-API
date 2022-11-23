import { User } from 'src/infrastructure/entity/user.orm-entity';
import { UserModel } from '../model/user.model';

export interface UserRepositoryPort {
  exists(email: string): Promise<boolean>;
  getOneById(id: string): Promise<UserModel | null>;
  getOneByEmail(email: string): Promise<UserModel | null>;
  save(user: UserModel): Promise<User>;
  getMany(): Promise<UserModel[] | null>;
  getOneWithRefreshToken(id: string): Promise<UserModel | null>;
}
