import { Module } from '@nestjs/common';
import { Provider } from '@nestjs/common/interfaces';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BoardFactory } from 'src/board/domain/board.factory';
import { LabelFactory } from 'src/board/domain/label.factory';
import { ListFactory } from 'src/board/domain/list.factory';
import { MemberFactory } from 'src/board/domain/member.factory';
import { BoardRepositoryAdapter } from 'src/board/infrastructure/repository/board.repository';
import { ListRepositoryAdapter } from 'src/board/infrastructure/repository/list.repository';
import { MemberRepositoryAdapter } from 'src/board/infrastructure/repository/member.repository';
import { HistoryModule } from 'src/history/history.module';
import { commandHandler } from './application/command/handler';
import { eventHandler } from './application/event-handler';
import { InjectionToken } from './application/injection.token';
import { queryHandler } from './application/query/handler';
import { AttachmentFactory } from './domain/attachment.factory';
import { CommentFactory } from './domain/comment.factory';
import { TaskFactory } from './domain/task.factory';
import { TodoFactory } from './domain/todo.factory';
import { AttachmentRepositoryAdapter } from './infrastructure/repository/attachment.repository';
import { CommentRepositoryAdapter } from './infrastructure/repository/comment.repository';
import { TaskRepositoryAdapter } from './infrastructure/repository/task.repository';
import { TodoRepositoryAdapter } from './infrastructure/repository/todo.repository';
import { AttachmentController } from './interface/controller/attachment.controller';
import { CommentController } from './interface/controller/comment.controller';
import { TaskController } from './interface/controller/task.controller';
import { TodoController } from './interface/controller/todo.controller';

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
];

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
    TaskController,
    AttachmentController,
    CommentController,
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
