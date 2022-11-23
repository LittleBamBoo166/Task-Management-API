import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result, Ok, Err } from 'oxide.ts';
import { IdResponse } from 'src/libs/dto/id.response.dto';
import {
  TaskMemberNotFound,
  TaskNotFoundError,
} from 'src/modules/task/domain/error/task.error';
import { Inject } from '@nestjs/common';
import { TaskRepositoryPort } from 'src/modules/task/domain/database/task.repository.port';
import { InjectionToken } from '../../../injection.token';
import { Checking } from 'src/libs/util/checking';
import { HistoryRepositoryPort } from 'src/libs/port/history.repository.port';
import { HistoryFactory } from 'src/libs/factory/history.factory';
import { RemoveTaskMemberCommand } from '../../impl/task/remove-task-member.command';

@CommandHandler(RemoveTaskMemberCommand)
export class RemoveTaskMemberHandler
  implements
    ICommandHandler<
      RemoveTaskMemberCommand,
      Result<IdResponse, TaskNotFoundError | TaskMemberNotFound>
    >
{
  constructor(
    @Inject(InjectionToken.TASK_REPOSITORY)
    private readonly taskRepository: TaskRepositoryPort,
    @Inject(InjectionToken.HISTORY_REPOSITORY)
    private readonly historyRepository: HistoryRepositoryPort,
    private readonly historyFactory: HistoryFactory,
  ) {}

  async execute(
    command: RemoveTaskMemberCommand,
  ): Promise<Result<IdResponse, TaskNotFoundError | TaskMemberNotFound>> {
    const task = await this.taskRepository.getOneById(
      command.taskId,
      command.requester.id,
    );
    if (Checking.isEmpty(task)) {
      return Err(new TaskNotFoundError());
    } else {
      const isMemberRemoved = task.removeMember(command.memberId);
      if (isMemberRemoved) {
        await this.taskRepository.save(task);
        const history = this.historyFactory.create({
          userId: command.requester.id,
          action: 'REMOVE',
          createOn: new Date(),
          taskId: command.taskId,
          message: `${command.requester.name} REMOVED A MEMBER FROM TASK`,
          content: { ...command },
        });
        await this.historyRepository.save(history);
        return Ok(new IdResponse(command.memberId));
      } else {
        return Err(new TaskMemberNotFound());
      }
    }
  }
}
