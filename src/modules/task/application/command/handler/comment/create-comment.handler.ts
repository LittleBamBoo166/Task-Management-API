import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result, Ok, Err } from 'oxide.ts';
import { IdResponse } from 'src/libs/dto/id.response.dto';
import { HistoryFactory } from 'src/libs/factory/history.factory';
import { HistoryRepositoryPort } from 'src/libs/port/history.repository.port';
import { Checking } from 'src/libs/util/checking';
import { MemberRepositoryPort } from 'src/modules/board/domain/database/member.repository.port';
import { CommentFactory } from 'src/modules/task/domain/comment.factory';
import { CommentRepositoryPort } from 'src/modules/task/domain/database/comment.repository.port';
import { TaskRepositoryPort } from 'src/modules/task/domain/database/task.repository.port';
import { TaskNotFoundError } from 'src/modules/task/domain/error/task.error';
import { InjectionToken } from '../../../injection.token';
import { CreateCommentCommand } from '../../impl/comment/create-comment.command';

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
    @Inject(InjectionToken.HISTORY_REPOSITORY)
    private readonly historyRepository: HistoryRepositoryPort,
    private readonly historyFactory: HistoryFactory,
  ) {}

  async execute(
    command: CreateCommentCommand,
  ): Promise<Result<IdResponse, TaskNotFoundError>> {
    const task = await this.taskRepository.getOneById(
      command.taskId,
      command.requester.id,
    );
    if (Checking.isEmpty(task)) {
      return Err(new TaskNotFoundError());
    } else {
      const member = await this.memberRepository.findOneByUserId(
        command.requester.id,
        task.getProperties().boardId,
      );
      const comment = this.commentFactory.create(
        command.content,
        member.getProperties().id,
      );
      await this.commentRepository.save(comment, command.taskId);
      const history = this.historyFactory.create({
        userId: command.requester.id,
        action: 'CREATE',
        createOn: new Date(),
        taskId: command.taskId,
        message: `${command.requester.name} CREATED COMMENT`,
        content: { ...command },
      });
      await this.historyRepository.save(history);
      return Ok(new IdResponse(comment.getProperties().id));
    }
  }
}
