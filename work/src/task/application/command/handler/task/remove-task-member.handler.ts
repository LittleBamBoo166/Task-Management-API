import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result, Ok, Err } from 'oxide.ts';
import { IdResponse } from 'src/libs/id.response.dto';
import {
  TaskMemberNotFound,
  TaskNotFoundError,
} from 'src/task/domain/error/task.error';
import { Inject } from '@nestjs/common';
import { TaskRepositoryPort } from 'src/task/domain/database/task.repository.port';
import { InjectionToken } from '../../../injection.token';
import { Checking } from 'src/libs/checking';
import { RemoveTaskMemberCommand } from '../../impl/task/remove-task-member.command';
import { HistoryService } from 'src/history/history.service';
import { CreateHistoryObject } from 'src/history/history.type';

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
    private readonly historyService: HistoryService,
  ) {}

  async execute(
    command: RemoveTaskMemberCommand,
  ): Promise<Result<IdResponse, TaskNotFoundError | TaskMemberNotFound>> {
    const task = await this.taskRepository.getOneById(
      command.taskId,
      command.requesterId,
    );
    if (Checking.isEmpty(task)) {
      return Err(new TaskNotFoundError());
    } else {
      const isMemberRemoved = task.removeMember(command.memberId);
      if (isMemberRemoved) {
        await this.taskRepository.save(task);
        const historyObject: CreateHistoryObject = {
          userId: command.requesterId,
          taskId: task.id,
          action: 'REMOVE',
          message: 'removed a member from the task',
          changedContent: {
            id: command.memberId,
          },
        };
        const historyEntity = this.historyService.create(historyObject);
        await this.historyService.save(historyEntity);
        return Ok(new IdResponse(command.memberId));
      } else {
        return Err(new TaskMemberNotFound());
      }
    }
  }
}
