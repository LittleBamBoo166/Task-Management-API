import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result, Ok, Err } from 'oxide.ts';
import { IdResponse } from 'src/libs/id.response.dto';
import { Checking } from 'src/libs/checking';
import { CommentRepositoryPort } from 'src/task/domain/database/comment.repository.port';
import { TaskRepositoryPort } from 'src/task/domain/database/task.repository.port';
import { CommentNotFoundError } from 'src/task/domain/error/comment.error';
import { TaskNotFoundError } from 'src/task/domain/error/task.error';
import { InjectionToken } from '../../../injection.token';
import { UpdateCommentCommand } from '../../impl/comment/update-comment.command';
import { HistoryService } from 'src/history/history.service';
import { CreateHistoryObject } from 'src/history/history.type';

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
    private readonly historyService: HistoryService,
  ) {}

  async execute(
    command: UpdateCommentCommand,
  ): Promise<Result<IdResponse, TaskNotFoundError | CommentNotFoundError>> {
    const task = await this.taskRepository.getOneById(
      command.taskId,
      command.requesterId,
    );
    if (Checking.isEmpty(task)) {
      return Err(new TaskNotFoundError());
    } else {
      const comment = await this.commentRepository.getOneById(
        command.id,
        command.requesterId,
      );
      if (Checking.isEmpty(comment)) {
        return Err(new CommentNotFoundError());
      } else {
        comment.edit({ ...command });
        await this.commentRepository.save(comment, command.taskId);
        const historyObject: CreateHistoryObject = {
          userId: command.requesterId,
          taskId: command.taskId,
          action: 'UPDATE',
          message: 'updated an attachment',
          changedContent: {
            id: command.id,
            old: comment.getProperties().content,
            new: command.content,
          },
        };
        const historyEntity = this.historyService.create(historyObject);
        await this.historyService.save(historyEntity);
        return Ok(new IdResponse(command.id));
      }
    }
  }
}
