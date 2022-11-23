import { Module, Provider } from '@nestjs/common';
import { TaskController } from './interface/controller/task.controller';
import { CommentController } from './interface/controller/comment.controller';
import { AttachmentController } from './interface/controller/attachment.controller';
import { InjectionToken } from './application/injection.token';
import { TaskRepositoryAdapter } from 'src/infrastructure/repository/task.repository';
import { AttachmentRepositoryAdapter } from 'src/infrastructure/repository/attachment.repository';
import { CommentRepositoryAdapter } from 'src/infrastructure/repository/comment.repository';
import { TaskFactory } from './domain/task.factory';
import { CqrsModule } from '@nestjs/cqrs';
import { commandHandler } from './application/command/handler';
import { queryHandler } from './application/query/handler';
import { ListRepositoryAdapter } from 'src/infrastructure/repository/list.repository';
import { ListFactory } from '../board/domain/list.factory';
import { MemberRepositoryAdapter } from 'src/infrastructure/repository/member.repository';
import { CommentFactory } from './domain/comment.factory';
import { AttachmentFactory } from './domain/attachment.factory';
import { MemberFactory } from '../board/domain/member.factory';
import { BoardRepositoryAdapter } from 'src/infrastructure/repository/board.repository';
import { BoardFactory } from '../board/domain/board.factory';
import { LabelFactory } from '../board/domain/label.factory';
import { TodoRepositoryAdapter } from 'src/infrastructure/repository/todo.repository';
import { TodoFactory } from './domain/todo.factory';
import { TodoController } from './interface/controller/todo.controller';
import { eventHandler } from './application/event-handler';
import { HistoryRepositoryAdapter } from 'src/infrastructure/repository/history.repository';
import { HistoryFactory } from 'src/libs/factory/history.factory';

const infrastructure: Provider[] = [
  {
    provide: InjectionToken.TASK_REPOSITORY,
    useClass: TaskRepositoryAdapter,
  },
  {
    provide: InjectionToken.ATTACHMENT_REPOSITORY,
    useClass: AttachmentRepositoryAdapter,
  },
  {
    provide: InjectionToken.COMMENT_REPOSITORY,
    useClass: CommentRepositoryAdapter,
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
    provide: InjectionToken.BOARD_REPOSITORY,
    useClass: BoardRepositoryAdapter,
  },
  {
    provide: InjectionToken.TODO_REPOSITORY,
    useClass: TodoRepositoryAdapter,
  },
  {
    provide: InjectionToken.HISTORY_REPOSITORY,
    useClass: HistoryRepositoryAdapter,
  },
];

const domain = [
  AttachmentFactory,
  TaskFactory,
  ListFactory,
  CommentFactory,
  MemberFactory,
  BoardFactory,
  LabelFactory,
  TodoFactory,
  HistoryFactory,
];

@Module({
  imports: [CqrsModule],
  controllers: [
    TaskController,
    CommentController,
    AttachmentController,
    TodoController,
  ],
  providers: [
    ...commandHandler,
    ...queryHandler,
    ...domain,
    ...infrastructure,
    ...eventHandler,
  ],
})
export class TaskModule {}
