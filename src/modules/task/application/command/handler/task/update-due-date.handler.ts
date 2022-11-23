import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result, Ok, Err } from 'oxide.ts';
import { IdResponse } from 'src/libs/dto/id.response.dto';
import {
  InvalidDueDateError,
  TaskNotFoundError,
} from 'src/modules/task/domain/error/task.error';
import { Inject } from '@nestjs/common';
import { TaskRepositoryPort } from 'src/modules/task/domain/database/task.repository.port';
import { InjectionToken } from '../../../injection.token';
import { Checking } from 'src/libs/util/checking';
import { UpdateDueDateCommand } from '../../impl/task/update-due-date.command';
import { HistoryRepositoryPort } from 'src/libs/port/history.repository.port';
import { HistoryFactory } from 'src/libs/factory/history.factory';

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
    @Inject(InjectionToken.HISTORY_REPOSITORY)
    private readonly historyRepository: HistoryRepositoryPort,
    private readonly historyFactory: HistoryFactory,
  ) {}

  async execute(
    command: UpdateDueDateCommand,
  ): Promise<Result<IdResponse, TaskNotFoundError | InvalidDueDateError>> {
    const task = await this.taskRepository.getOneById(
      command.id,
      command.requester.id,
    );
    if (Checking.isEmpty(task)) {
      return Err(new TaskNotFoundError());
    } else {
      const isDueDateSet = task.setDueDate(command.dueDate);
      if (isDueDateSet) {
        await this.taskRepository.save(task);
        const history = this.historyFactory.create({
          userId: command.requester.id,
          action: 'UPDATE',
          createOn: new Date(),
          taskId: command.id,
          message: `${command.requester.name} UPDATED DUE DATE OF TASK`,
          content: { ...command },
        });
        await this.historyRepository.save(history);
        return Ok(new IdResponse(command.id));
      } else {
        return Err(new InvalidDueDateError());
      }
    }
  }
}
