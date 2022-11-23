import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteTaskCommand } from '../../impl/task/delete-task.command';
import { Result, Ok, Err } from 'oxide.ts';
import { IdResponse } from 'src/libs/dto/id.response.dto';
import { TaskNotFoundError } from 'src/modules/task/domain/error/task.error';
import { Inject } from '@nestjs/common';
import { InjectionToken } from '../../../injection.token';
import { TaskRepositoryPort } from 'src/modules/task/domain/database/task.repository.port';
import { Checking } from 'src/libs/util/checking';
import { AttachmentRepositoryPort } from 'src/modules/task/domain/database/attachment.repository.port';
import { CommentRepositoryPort } from 'src/modules/task/domain/database/comment.repository.port';
import { HistoryRepositoryPort } from 'src/libs/port/history.repository.port';
import { HistoryFactory } from 'src/libs/factory/history.factory';
import { TodoRepositoryPort } from 'src/modules/task/domain/database/todo.repository.port';

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
    @Inject(InjectionToken.HISTORY_REPOSITORY)
    private readonly historyRepository: HistoryRepositoryPort,
    private readonly historyFactory: HistoryFactory,
  ) {}

  async execute(
    command: DeleteTaskCommand,
  ): Promise<Result<IdResponse, TaskNotFoundError>> {
    const task = await this.taskRepository.getOneById(
      command.id,
      command.requester.id,
    );
    if (Checking.isEmpty(task)) {
      return Err(new TaskNotFoundError());
    } else {
      await this.todoRepository.deleteMany('taskId', command.id);
      await this.attachmentRepository.deleteMany('taskId', command.id);
      await this.commentRepository.deleteMany('taskId', command.id);
      await this.taskRepository.delete(command.id);
      const history = this.historyFactory.create({
        userId: command.requester.id,
        action: 'DELETE',
        createOn: new Date(),
        taskId: command.id,
        message: `${command.requester.name} DELETED TASK`,
        content: { ...command },
      });
      await this.historyRepository.save(history);
      return Ok(new IdResponse(command.id));
    }
  }
}
