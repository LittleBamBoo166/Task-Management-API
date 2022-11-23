import { Module, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { commandHandler } from './application/command/handler';
import { InjectionToken } from './application/injection.token';
import { RequestFactory } from './domain/request.factory';
import { RequestDetailRepositoryAdapter } from './infrastructure/repository/request-detail.repository';
import { RequestRepositoryAdapter } from './infrastructure/repository/request.repository';
import { RequestController } from './interface/controller/request.controller';

const infrastructure: Provider[] = [
  {
    provide: InjectionToken.REQUEST_REPOSITORY,
    useClass: RequestRepositoryAdapter,
  },
  {
    provide: InjectionToken.REQUEST_DETAIL_REPOSITORY,
    useClass: RequestDetailRepositoryAdapter,
  },
];

const domain = [RequestFactory];

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: 'AUTH_CLIENT',
        transport: Transport.TCP,
        options: {
          // host: process.env.HOST,
          // port: parseInt(process.env.AUTH_HOST),
          host: '127.0.0.1',
          port: 3002,
        },
      },
    ]),
  ],
  controllers: [RequestController],
  providers: [...commandHandler, ...domain, ...infrastructure],
})
export class RequestModule {}
