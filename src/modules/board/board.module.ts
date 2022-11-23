import { Module, Provider } from '@nestjs/common';
import { BoardController } from './interface/controller/board.controller';
import { MemberController } from './interface/controller/member.controller';
import { LabelController } from './interface/controller/label.controller';
import { ListController } from './interface/controller/list.controller';
import { InjectionToken } from './application/injection.token';
import { BoardRepositoryAdapter } from 'src/infrastructure/repository/board.repository';
import { BoardFactory } from './domain/board.factory';
import { CqrsModule } from '@nestjs/cqrs';
import { commandHandler } from './application/command/handler';
import { queryHandler } from './application/query/handler';
import { eventHandlers } from './application/event-handler';
import { ListFactory } from './domain/list.factory';
import { ListRepositoryAdapter } from 'src/infrastructure/repository/list.repository';
import { MemberFactory } from './domain/member.factory';
import { MemberRepositoryAdapter } from 'src/infrastructure/repository/member.repository';
import { LabelRepositoryAdapter } from 'src/infrastructure/repository/label.repository';
import { LabelFactory } from './domain/label.factory';
import { HistoryRepositoryAdapter } from 'src/infrastructure/repository/history.repository';
import { HistoryFactory } from 'src/libs/factory/history.factory';

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
  {
    provide: InjectionToken.HISTORY_REPOSITORY,
    useClass: HistoryRepositoryAdapter,
  },
];

const domain = [
  BoardFactory,
  ListFactory,
  MemberFactory,
  LabelFactory,
  HistoryFactory,
];

@Module({
  imports: [CqrsModule],
  controllers: [
    BoardController,
    MemberController,
    LabelController,
    ListController,
  ],
  providers: [
    ...commandHandler,
    ...queryHandler,
    ...eventHandlers,
    ...infrastructure,
    ...domain,
  ],
})
export class BoardModule {}
