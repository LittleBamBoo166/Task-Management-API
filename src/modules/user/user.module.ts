import { Module, Provider } from '@nestjs/common';
import { UserController } from './interface/controller/user.controller';
import { AuthController } from './interface/controller/auth.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { commandHandlers } from './application/command/handler';
import { InjectionToken } from './application/injection.token';
import { UserRepositoryAdapter } from 'src/infrastructure/repository/user.repository';
import { UserFactory } from './domain/user.factory';
import { queryHandlers } from './application/query/handler';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtConstants } from '../../libs/auth/jwt-constants';
import { LocalStrategy } from '../../libs/auth/strategy/local.strategy';
import { JwtStrategy } from '../../libs/auth/strategy/jwt.strategy';
import { JwtRefreshTokenStrategy } from '../../libs/auth/strategy/jwt-refresh-token.strategy';

const infrastructure: Provider[] = [
  {
    provide: InjectionToken.USER_REPOSITORY,
    useClass: UserRepositoryAdapter,
  },
];

const domain = [UserFactory];
const auth = [LocalStrategy, JwtStrategy, JwtRefreshTokenStrategy];

@Module({
  imports: [
    CqrsModule,
    PassportModule.register({ defaultStrategy: 'local' }),
    JwtModule.register({
      secret: JwtConstants.secrect,
      signOptions: { expiresIn: JwtConstants.expiredIn },
    }),
  ],
  controllers: [UserController, AuthController],
  providers: [
    ...commandHandlers,
    ...queryHandlers,
    ...infrastructure,
    ...domain,
    ...auth,
  ],
})
export class UserModule {}
