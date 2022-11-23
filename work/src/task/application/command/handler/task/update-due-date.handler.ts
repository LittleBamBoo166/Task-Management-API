import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result, Ok, Err } from 'oxide.ts';
import { IdResponse } from 'src/libs/id.response.dto';
import {
  InvalidDueDateError,
  TaskNotFoundError,
} from 'src/task/domain/error/task.error';
import { Inject } from '@nestjs/common';
import { TaskRepositoryPort } from 'src/task/domain/database/task.repository.port';
import { InjectionToken } from '../../../injection.token';
import { Checking } from 'src/libs/checking';
import { UpdateDueDateCommand } from '../../impl/task/update-due-date.command';
import { HistoryService } from 'src/history/history.service';
import { CreateHistoryObject } from 'src/history/history.type';

@CommandHandler(UpdateDueDateCommand)
export class UpdateDueDateHandler
  implements
    ICommandHandler<
      UpdateDueDateCommand,
      Result<IdResponse, TaskNotFoundError | InvalidDueDateError>
    >
{
  constructor(
    @Inject(InjectionToken.TASK_REPOSITORY)
    private readonly taskRepository: TaskRepositoryPort,
    private readonly historyService: HistoryService,
  ) {}

  async execute(
    command: UpdateDueDateCommand,
  ): Promise<Result<IdResponse, TaskNotFoundError | InvalidDueDateError>> {
    const task = await this.taskRepository.getOneById(
      command.id,
      command.requesterId,
    );
    if (Checking.isEmpty(task)) {
      return Err(new TaskNotFoundError());
    } else {
      const isDueDateSet = task.setDueDate(command.dueDate);
      if (isDueDateSet) {
        await this.taskRepository.save(task);
        const historyObject: CreateHistoryObject = {
          userId: command.requesterId,
          taskId: task.id,
          action: 'UPDATE',
          message: 'updated the due date of the task',
          changedContent: {
            old: task.getProperties().dueDate,
            new: command.dueDate,
          },
        };
        const historyEntity = this.historyService.create(historyObject);
        await this.historyService.save(historyEntity);
        return Ok(new IdResponse(command.id));
      } else {
        return Err(new InvalidDueDateError());
      }
    }
  }
}
