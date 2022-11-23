import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result, Ok, Err } from 'oxide.ts';
import { IdResponse } from 'src/libs/dto/id.response.dto';
import {
  InvalidLabelError,
  LabelAlreadyExistError,
  TaskNotFoundError,
} from 'src/modules/task/domain/error/task.error';
import { Inject } from '@nestjs/common';
import { TaskRepositoryPort } from 'src/modules/task/domain/database/task.repository.port';
import { InjectionToken } from '../../../injection.token';
import { Checking } from 'src/libs/util/checking';
import { HistoryRepositoryPort } from 'src/libs/port/history.repository.port';
import { HistoryFactory } from 'src/libs/factory/history.factory';
import { AddTaskLabelCommand } from '../../impl/task/add-task-label.command';

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
    @Inject(InjectionToken.HISTORY_REPOSITORY)
    private readonly historyRepository: HistoryRepositoryPort,
    private readonly historyFactory: HistoryFactory,
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
      command.requester.id,
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
          const history = this.historyFactory.create({
            userId: command.requester.id,
            action: 'ADD',
            createOn: new Date(),
            taskId: command.taskId,
            message: `${command.requester.name} ADD LABEL TO TASK`,
            content: { ...command },
          });
          await this.historyRepository.save(history);
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
