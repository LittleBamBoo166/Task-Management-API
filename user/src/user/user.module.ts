import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { commandHandler } from './application/command/handler';
import { InjectionToken } from './application/injection.token';
import { queryHandler } from './application/query/handler';
import { UserFactory } from './domain/user.factory';
import { UserRepositoryAdapter } from './infrastructure/repository/user.repository';
import { UserController } from './interface/controller/user.controller';
import { UserService } from './application/user.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from 'src/mail/mail.module';
import { JwtModule } from '@nestjs/jwt';

const infrastructure: Provider[] = [
  {
    provide: InjectionToken.USER_REPOSITORY,
    useClass: UserRepositoryAdapter,
  },
];

const domain = [UserFactory];

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_VERIFICATION_TOKEN_SECRET,
      signOptions: { expiresIn: process.env.JWT_VERIFICATION_TOKEN_EXPIRE },
    }),
    MailModule,
    CqrsModule,
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: 'AUTH_CLIENT',
        transport: Transport.TCP,
        options: {
          host: process.env.HOST,
          port: parseInt(process.env.AUTH_PORT),
          // host: '127.0.0.1',
          // port: 3002,
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [
    ...commandHandler,
    ...queryHandler,
    ...infrastructure,
    ...domain,
    // ...guard,
    UserService,
  ],
})
export class UserModule {}
