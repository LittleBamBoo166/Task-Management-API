import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result, Ok, Err } from 'oxide.ts';
import { IdResponse } from 'src/libs/dto/id.response.dto';
import { HistoryFactory } from 'src/libs/factory/history.factory';
import { HistoryRepositoryPort } from 'src/libs/port/history.repository.port';
import { Checking } from 'src/libs/util/checking';
import { CommentRepositoryPort } from 'src/modules/task/domain/database/comment.repository.port';
import { TaskRepositoryPort } from 'src/modules/task/domain/database/task.repository.port';
import { CommentNotFoundError } from 'src/modules/task/domain/error/comment.error';
import { TaskNotFoundError } from 'src/modules/task/domain/error/task.error';
import { InjectionToken } from '../../../injection.token';
import { UpdateCommentCommand } from '../../impl/comment/update-comment.command';

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentHandler
  implements
    ICommandHandler<
      UpdateCommentCommand,
      Result<IdResponse, CommentNotFoundError | TaskNotFoundError>
    >
{
  constructor(
    @Inject(InjectionToken.COMMENT_REPOSITORY)
    private readonly commentRepository: CommentRepositoryPort,
    @Inject(InjectionToken.TASK_REPOSITORY)
    private readonly taskRepository: TaskRepositoryPort,
    @Inject(InjectionToken.HISTORY_REPOSITORY)
    private readonly historyRepository: HistoryRepositoryPort,
    private readonly historyFactory: HistoryFactory,
  ) {}

  async execute(
    command: UpdateCommentCommand,
  ): Promise<Result<IdResponse, TaskNotFoundError | CommentNotFoundError>> {
    const task = await this.taskRepository.getOneById(
      command.taskId,
      command.requester.id,
    );
    if (Checking.isEmpty(task)) {
      return Err(new TaskNotFoundError());
    } else {
      const comment = await this.commentRepository.getOneById(
        command.id,
        command.requester.id,
      );
      if (Checking.isEmpty(comment)) {
        return Err(new CommentNotFoundError());
      } else {
        comment.edit({ ...command });
        await this.commentRepository.save(comment, command.taskId);
        const history = this.historyFactory.create({
          userId: command.requester.id,
          action: 'UPDATE',
          createOn: new Date(),
          taskId: command.taskId,
          message: `${command.requester.name} UPDATED COMMENT`,
          content: { ...command },
        });
        await this.historyRepository.save(history);
        return Ok(new IdResponse(command.id));
      }
    }
  }
}
