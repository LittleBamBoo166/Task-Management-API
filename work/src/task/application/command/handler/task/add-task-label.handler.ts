import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result, Ok, Err } from 'oxide.ts';
import { IdResponse } from 'src/libs/id.response.dto';
import {
  InvalidLabelError,
  LabelAlreadyExistError,
  TaskNotFoundError,
} from 'src/task/domain/error/task.error';
import { Inject } from '@nestjs/common';
import { TaskRepositoryPort } from 'src/task/domain/database/task.repository.port';
import { InjectionToken } from '../../../injection.token';
import { Checking } from 'src/libs/checking';
import { AddTaskLabelCommand } from '../../impl/task/add-task-label.command';
import { HistoryService } from 'src/history/history.service';
import { CreateHistoryObject } from 'src/history/history.type';

@CommandHandler(AddTaskLabelCommand)
export class AddTaskLabelHandler
  implements
    ICommandHandler<
      AddTaskLabelCommand,
      Result<
        IdResponse,
        TaskNotFoundError | InvalidLabelError | LabelAlreadyExistError
      >
    >
{
  constructor(
    @Inject(InjectionToken.TASK_REPOSITORY)
    private readonly taskRepository: TaskRepositoryPort,
    private readonly historyService: HistoryService,
  ) {}

  async execute(
    command: AddTaskLabelCommand,
  ): Promise<
    Result<
      IdResponse,
      TaskNotFoundError | InvalidLabelError | LabelAlreadyExistError
    >
  > {
    const task = await this.taskRepository.getOneById(
      command.taskId,
      command.requesterId,
    );
    if (Checking.isEmpty(task)) {
      return Err(new TaskNotFoundError());
    } else {
      const isLabelValid = await this.taskRepository.validLabel(
        command.labelId,
        command.taskId,
      );
      if (isLabelValid) {
        const isLabelAdded = task.addLabel(command.labelId);
        if (isLabelAdded) {
          await this.taskRepository.save(task);
          const historyObject: CreateHistoryObject = {
            userId: command.requesterId,
            taskId: command.taskId,
            action: 'ADD',
            message: 'added a label to the task',
            changedContent: {
              id: command.labelId,
            },
          };
          const historyEntity = this.historyService.create(historyObject);
          await this.historyService.save(historyEntity);
          return Ok(new IdResponse(command.labelId));
        } else {
          return Err(new LabelAlreadyExistError());
        }
      } else {
        return Err(new InvalidLabelError());
      }
    }
  }
}
