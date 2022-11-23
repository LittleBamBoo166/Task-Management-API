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
import { AddTaskMemberCommand } from '../../impl/task/add-task-member.command';
import { HistoryService } from 'src/history/history.service';
import { CreateHistoryObject } from 'src/history/history.type';

@CommandHandler(AddTaskMemberCommand)
export class AddTaskMemberHandler
  implements
    ICommandHandler<
      AddTaskMemberCommand,
      Result<IdResponse, TaskNotFoundError | InvalidMemberError>
    >
{
  constructor(
    @Inject(InjectionToken.TASK_REPOSITORY)
    private readonly taskRepository: TaskRepositoryPort,
    private readonly historyService: HistoryService,
  ) {}

  async execute(
    command: AddTaskMemberCommand,
  ): Promise<Result<IdResponse, TaskNotFoundError | InvalidMemberError>> {
    const task = await this.taskRepository.getOneById(
      command.taskId,
      command.requesterId,
    );
    if (Checking.isEmpty(task)) {
      return Err(new TaskNotFoundError());
    } else {
      const isMemberAdded = task.addMember(command.memberId);
      if (isMemberAdded) {
        await this.taskRepository.save(task);
        const historyObject: CreateHistoryObject = {
          userId: command.requesterId,
          taskId: command.taskId,
          action: 'ADD',
          message: 'added a member to the task',
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
