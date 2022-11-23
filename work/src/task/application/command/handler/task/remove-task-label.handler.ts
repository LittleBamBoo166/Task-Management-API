import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result, Ok, Err } from 'oxide.ts';
import { IdResponse } from 'src/libs/id.response.dto';
import {
  LabelNotFoundError,
  TaskNotFoundError,
} from 'src/task/domain/error/task.error';
import { Inject } from '@nestjs/common';
import { TaskRepositoryPort } from 'src/task/domain/database/task.repository.port';
import { InjectionToken } from '../../../injection.token';
import { Checking } from 'src/libs/checking';
import { RemoveTaskLabelCommand } from '../../impl/task/remove-task-label.command';
import { HistoryService } from 'src/history/history.service';
import { CreateHistoryObject } from 'src/history/history.type';

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
    private readonly historyService: HistoryService,
  ) {}

  async execute(
    command: RemoveTaskLabelCommand,
  ): Promise<Result<IdResponse, TaskNotFoundError | LabelNotFoundError>> {
    const task = await this.taskRepository.getOneById(
      command.taskId,
      command.requesterId,
    );
    if (Checking.isEmpty(task)) {
      return Err(new TaskNotFoundError());
    } else {
      const isLabelRemoved = task.removeLabel(command.labelId);
      if (isLabelRemoved) {
        await this.taskRepository.save(task);
        const historyObject: CreateHistoryObject = {
          userId: command.requesterId,
          taskId: task.id,
          action: 'REMOVE',
          message: 'removed a label from the task',
          changedContent: {
            id: command.labelId,
          },
        };
        const historyEntity = this.historyService.create(historyObject);
        await this.historyService.save(historyEntity);
        return Ok(new IdResponse(command.labelId));
      } else {
        return Err(new LabelNotFoundError());
      }
    }
  }
}
