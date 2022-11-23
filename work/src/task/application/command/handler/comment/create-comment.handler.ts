import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result, Ok, Err } from 'oxide.ts';
import { IdResponse } from 'src/libs/id.response.dto';
import { Checking } from 'src/libs/checking';
import { MemberRepositoryPort } from 'src/board/domain/database/member.repository.port';
import { CommentFactory } from 'src/task/domain/comment.factory';
import { CommentRepositoryPort } from 'src/task/domain/database/comment.repository.port';
import { TaskRepositoryPort } from 'src/task/domain/database/task.repository.port';
import { TaskNotFoundError } from 'src/task/domain/error/task.error';
import { InjectionToken } from '../../../injection.token';
import { CreateCommentCommand } from '../../impl/comment/create-comment.command';
import { HistoryService } from 'src/history/history.service';
import { CreateHistoryObject } from 'src/history/history.type';

@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler
  implements
    ICommandHandler<
      CreateCommentCommand,
      Result<IdResponse, TaskNotFoundError>
    >
{
  constructor(
    @Inject(InjectionToken.COMMENT_REPOSITORY)
    private readonly commentRepository: CommentRepositoryPort,
    private readonly commentFactory: CommentFactory,
    @Inject(InjectionToken.TASK_REPOSITORY)
    private readonly taskRepository: TaskRepositoryPort,
    @Inject(InjectionToken.MEMBER_REPOSITORY)
    private readonly memberRepository: MemberRepositoryPort,
    private readonly historyService: HistoryService,
  ) {}

  async execute(
    command: CreateCommentCommand,
  ): Promise<Result<IdResponse, TaskNotFoundError>> {
    const task = await this.taskRepository.getOneById(
      command.taskId,
      command.requesterId,
    );
    if (Checking.isEmpty(task)) {
      return Err(new TaskNotFoundError());
    } else {
      const member = await this.memberRepository.findOneByUserId(
        command.requesterId,
        task.getProperties().boardId,
      );
      const comment = this.commentFactory.create(
        command.content,
        member.getProperties().id,
      );
      await this.commentRepository.save(comment, command.taskId);
      const historyObject: CreateHistoryObject = {
        userId: command.requesterId,
        taskId: command.taskId,
        action: 'CREATE',
        message: 'updated an attachment',
        changedContent: {
          id: comment.getProperties().id,
          content: command.content,
        },
      };
      const historyEntity = this.historyService.create(historyObject);
      await this.historyService.save(historyEntity);
      return Ok(new IdResponse(comment.getProperties().id));
    }
  }
}
