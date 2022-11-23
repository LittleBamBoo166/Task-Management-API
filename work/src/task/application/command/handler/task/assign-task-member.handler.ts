import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result, Ok, Err } from 'oxide.ts';
import { IdResponse } from 'src/libs/id.response.dto';
import {
  InvalidMemberError,
  TaskNotFoundError,
} from 'src/task/domain/error/task.error';
import { Inject } from '@nestjs/common';
import { TaskRepositoryPort } from 'src/task/domain/database/task.repository.port';
import { InjectionToken } from '../../../injection.token';
import { Checking } from 'src/libs/checking';
import { AssignTaskMemberCommand } from '../../impl/task/assign-task-member.command';
import { HistoryService } from 'src/history/history.service';
import { CreateHistoryObject } from 'src/history/history.type';

@CommandHandler(AssignTaskMemberCommand)
export class AssignTaskMemberHandler
  implements
    ICommandHandler<
      AssignTaskMemberCommand,
      Result<IdResponse, TaskNotFoundError | InvalidMemberError>
    >
{
  constructor(
    @Inject(InjectionToken.TASK_REPOSITORY)
    private readonly taskRepository: TaskRepositoryPort,
    private readonly historyService: HistoryService,
  ) {}

  async execute(
    command: AssignTaskMemberCommand,
  ): Promise<Result<IdResponse, TaskNotFoundError | InvalidMemberError>> {
    const task = await this.taskRepository.getOneById(
      command.taskId,
      command.requesterId,
    );
    if (Checking.isEmpty(task)) {
      return Err(new TaskNotFoundError());
    } else {
      const isMemberAssigned = task.assignToMember(command.memberId);
      if (isMemberAssigned) {
        await this.taskRepository.save(task);
        const historyObject: CreateHistoryObject = {
          userId: command.requesterId,
          taskId: command.taskId,
          action: 'ASSIGN',
          message: 'assigned the task to a member',
          changedContent: {
            id: command.memberId,
          },
        };
        const historyEntity = this.historyService.create(historyObject);
        await this.historyService.save(historyEntity);
        return Ok(new IdResponse(command.memberId));
      } else {
        return Err(new InvalidMemberError());
      }
    }
  }
}
