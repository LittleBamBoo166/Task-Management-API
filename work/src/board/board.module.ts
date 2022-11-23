import { Module, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HistoryModule } from 'src/history/history.module';
import { commandHandler } from './application/command/handler';
import { eventHandlers } from './application/event-handler';
import { InjectionToken } from './application/injection.token';
import { queryHandler } from './application/query/handler';
import { BoardFactory } from './domain/board.factory';
import { LabelFactory } from './domain/label.factory';
import { ListFactory } from './domain/list.factory';
import { MemberFactory } from './domain/member.factory';
import { BoardRepositoryAdapter } from './infrastructure/repository/board.repository';
import { LabelRepositoryAdapter } from './infrastructure/repository/label.repository';
import { ListRepositoryAdapter } from './infrastructure/repository/list.repository';
import { MemberRepositoryAdapter } from './infrastructure/repository/member.repository';
import { BoardController } from './interface/controller/board.controller';
import { LabelController } from './interface/controller/label.controller';
import { ListController } from './interface/controller/list.controller';
import { MemberController } from './interface/controller/member.controller';

const infrastructure: Provider[] = [
  {
    provide: InjectionToken.BOARD_REPOSITORY,
    useClass: BoardRepositoryAdapter,
  },
  {
    provide: InjectionToken.LIST_REPOSITORY,
    useClass: ListRepositoryAdapter,
  },
  {
    provide: InjectionToken.MEMBER_REPOSITORY,
    useClass: MemberRepositoryAdapter,
  },
  {
    provide: InjectionToken.LABEL_REPOSITORY,
    useClass: LabelRepositoryAdapter,
  },
];

const domain = [BoardFactory, ListFactory, MemberFactory, LabelFactory];

@Module({
  imports: [
    HistoryModule,
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
  controllers: [
    BoardController,
    LabelController,
    ListController,
    MemberController,
  ],
  providers: [
    ...commandHandler,
    ...queryHandler,
    ...infrastructure,
    ...domain,
    ...eventHandlers,
  ],
})
export class BoardModule {}
