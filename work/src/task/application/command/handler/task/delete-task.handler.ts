import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteTaskCommand } from '../../impl/task/delete-task.command';
import { Result, Ok, Err } from 'oxide.ts';
import { IdResponse } from 'src/libs/id.response.dto';
import { TaskNotFoundError } from 'src/task/domain/error/task.error';
import { Inject } from '@nestjs/common';
import { InjectionToken } from '../../../injection.token';
import { TaskRepositoryPort } from 'src/task/domain/database/task.repository.port';
import { Checking } from 'src/libs/checking';
import { AttachmentRepositoryPort } from 'src/task/domain/database/attachment.repository.port';
import { CommentRepositoryPort } from 'src/task/domain/database/comment.repository.port';
import { TodoRepositoryPort } from 'src/task/domain/database/todo.repository.port';
import { HistoryService } from 'src/history/history.service';
import { CreateHistoryObject } from 'src/history/history.type';

@CommandHandler(DeleteTaskCommand)
export class DeleteTaskHandler
  implements
    ICommandHandler<DeleteTaskCommand, Result<IdResponse, TaskNotFoundError>>
{
  constructor(
    @Inject(InjectionToken.TASK_REPOSITORY)
    private readonly taskRepository: TaskRepositoryPort,
    @Inject(InjectionToken.ATTACHMENT_REPOSITORY)
    private readonly attachmentRepository: AttachmentRepositoryPort,
    @Inject(InjectionToken.COMMENT_REPOSITORY)
    private readonly commentRepository: CommentRepositoryPort,
    @Inject(InjectionToken.TODO_REPOSITORY)
    private readonly todoRepository: TodoRepositoryPort,
    private readonly historyService: HistoryService,
  ) {}

  async execute(
    command: DeleteTaskCommand,
  ): Promise<Result<IdResponse, TaskNotFoundError>> {
    const task = await this.taskRepository.getOneById(
      command.id,
      command.requesterId,
    );
    if (Checking.isEmpty(task)) {
      return Err(new TaskNotFoundError());
    } else {
      await this.todoRepository.deleteMany('taskId', command.id);
      await this.attachmentRepository.deleteMany('taskId', command.id);
      await this.commentRepository.deleteMany('taskId', command.id);
      await this.taskRepository.delete(command.id);
      const historyObject: CreateHistoryObject = {
        userId: command.requesterId,
        taskId: task.id,
        action: 'DELETE',
        message: 'deleted the task',
        changedContent: {
          name: task.getProperties().name,
        },
      };
      const historyEntity = this.historyService.create(historyObject);
      await this.historyService.save(historyEntity);
      return Ok(new IdResponse(command.id));
    }
  }
}
