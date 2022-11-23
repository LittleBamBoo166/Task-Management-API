import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result, Ok, Err } from 'oxide.ts';
import { IdResponse } from 'src/libs/dto/id.response.dto';
import {
  LabelNotFoundError,
  TaskNotFoundError,
} from 'src/modules/task/domain/error/task.error';
import { Inject } from '@nestjs/common';
import { TaskRepositoryPort } from 'src/modules/task/domain/database/task.repository.port';
import { InjectionToken } from '../../../injection.token';
import { Checking } from 'src/libs/util/checking';
import { HistoryRepositoryPort } from 'src/libs/port/history.repository.port';
import { HistoryFactory } from 'src/libs/factory/history.factory';
import { RemoveTaskLabelCommand } from '../../impl/task/remove-task-label.command';

@CommandHandler(RemoveTaskLabelCommand)
export class RemoveTaskLabelHandler
  implements
    ICommandHandler<
      RemoveTaskLabelCommand,
      Result<IdResponse, TaskNotFoundError | LabelNotFoundError>
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
    command: RemoveTaskLabelCommand,
  ): Promise<Result<IdResponse, TaskNotFoundError | LabelNotFoundError>> {
    const task = await this.taskRepository.getOneById(
      command.taskId,
      command.requester.id,
    );
    if (Checking.isEmpty(task)) {
      return Err(new TaskNotFoundError());
    } else {
      const isLabelRemoved = task.removeLabel(command.labelId);
      if (isLabelRemoved) {
        await this.taskRepository.save(task);
        const history = this.historyFactory.create({
          userId: command.requester.id,
          action: 'REMOVE',
          createOn: new Date(),
          taskId: command.taskId,
          message: `${command.requester.name} REMOVED A LABEL FROM TASK`,
          content: { ...command },
        });
        await this.historyRepository.save(history);
        return Ok(new IdResponse(command.labelId));
      } else {
        return Err(new LabelNotFoundError());
      }
    }
  }
}
