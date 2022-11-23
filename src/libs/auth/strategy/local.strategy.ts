import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Checking } from 'src/libs/util/checking';
import { InjectionToken } from 'src/modules/user/application/injection.token';
import { UserRepositoryPort } from 'src/modules/user/domain/database/user.repository.port';
import { UserModel } from 'src/modules/user/domain/model/user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(InjectionToken.USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
  ) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<UserModel> {
    try {
      const user = await this.userRepository.getOneByEmail(email);
      if (Checking.isEmpty(user)) {
        throw new NotFoundException(
          'Wrong credentials provided: User not found',
        );
      }
      const isPasswordEqual = bcrypt.compareSync(password, user.getPassword());
      if (isPasswordEqual) {
        return user;
      } else {
        throw new ConflictException(
          'Wrong credentials provided: Incorrect password',
        );
      }
    } catch (error) {
      console.log(error);
      throw new ConflictException('Wrong credentials provided');
    }
  }
}
