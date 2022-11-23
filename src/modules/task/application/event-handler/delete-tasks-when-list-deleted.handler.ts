import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserDeletedListEvent } from 'src/modules/board/domain/event/user-deleted-list.event';
import { AttachmentRepositoryPort } from '../../domain/database/attachment.repository.port';
import { CommentRepositoryPort } from '../../domain/database/comment.repository.port';
import { TaskRepositoryPort } from '../../domain/database/task.repository.port';
import { TodoRepositoryPort } from '../../domain/database/todo.repository.port';
import { InjectionToken } from '../injection.token';

@EventsHandler(UserDeletedListEvent)
export class DeleteTasksWhenListDeletedHandler
  implements IEventHandler<UserDeletedListEvent>
{
  constructor(
    @Inject(InjectionToken.TASK_REPOSITORY)
    private taskRepository: TaskRepositoryPort,
    @Inject(InjectionToken.ATTACHMENT_REPOSITORY)
    private attachmentRepository: AttachmentRepositoryPort,
    @Inject(InjectionToken.COMMENT_REPOSITORY)
    private commentRepository: CommentRepositoryPort,
    @Inject(InjectionToken.TODO_REPOSITORY)
    private todoRepository: TodoRepositoryPort,
  ) {}

  async handle(event: UserDeletedListEvent) {
    const isAttachmentDeleted = await this.attachmentRepository.deleteMany(
      'listId',
      event.id,
    );
    console.log(`Delete attachment: ${isAttachmentDeleted}`);
    const isCommentDeleted = await this.commentRepository.deleteMany(
      'listId',
      event.id,
    );
    console.log(`Delete comment: ${isCommentDeleted}`);
    const isTodoDeleted = await this.todoRepository.deleteMany(
      'listId',
      event.id,
    );
    console.log(`Delete todo: ${isTodoDeleted}`);
    const isDeleted = await this.taskRepository.deleteMany('listId', event.id);
    console.log(`Delete task: ${isDeleted}`);
  }
}
