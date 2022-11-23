import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { AttachmentRepositoryPort } from '../../domain/database/attachment.repository.port';
import { CommentRepositoryPort } from '../../domain/database/comment.repository.port';
import { TaskRepositoryPort } from '../../domain/database/task.repository.port';
import { InjectionToken } from '../injection.token';
import { ListDeletedWhenBoardDeletedEvent } from 'src/board/domain/event/list-deleted-when-board-deleted.event';
import { TodoRepositoryPort } from '../../domain/database/todo.repository.port';
import { UserDeletedBoardEvent } from 'src/board/domain/event/user-deleted-board.event';

@EventsHandler(UserDeletedBoardEvent)
export class DeleteTasksWhenBoardDeletedHandler
  implements IEventHandler<ListDeletedWhenBoardDeletedEvent>
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

  async handle(event: UserDeletedBoardEvent) {
    const isAttachmentDeleted = await this.attachmentRepository.deleteMany(
      'boardId',
      event.boardId,
    );
    console.log(`Delete attachment: ${isAttachmentDeleted}`);
    const isCommentDeleted = await this.commentRepository.deleteMany(
      'boardId',
      event.boardId,
    );
    console.log(`Delete comment: ${isCommentDeleted}`);
    const isTodoDeleted = await this.todoRepository.deleteMany(
      'boardId',
      event.boardId,
    );
    console.log(`Delete todo: ${isTodoDeleted}`);
    const isDeleted = await this.taskRepository.deleteMany(
      'boardId',
      event.boardId,
    );
    console.log(`Delete task: ${isDeleted}`);
  }
}
