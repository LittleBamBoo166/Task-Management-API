import { UserModel } from '../model/user.model';
import { User } from 'src/user/infrastructure/entity/user.orm-entity';

export interface UserRepositoryPort {
  exists(email: string): Promise<boolean>;
  getOneById(id: string): Promise<UserModel | null>;
  getOneByEmail(email: string): Promise<User | null>;
  save(user: UserModel): Promise<User>;
  getMany(): Promise<UserModel[] | null>;
  getOneWithRefreshToken(id: string): Promise<User | null>;
  saveRefreshToken(id: string, refreshToken: string);
}
