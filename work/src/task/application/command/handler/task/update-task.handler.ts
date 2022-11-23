import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateTaskCommand } from '../../impl/task/update-task.command';
import { Result, Ok, Err } from 'oxide.ts';
import { IdResponse } from 'src/libs/id.response.dto';
import { TaskNotFoundError } from 'src/task/domain/error/task.error';
import { Inject } from '@nestjs/common';
import { TaskRepositoryPort } from 'src/task/domain/database/task.repository.port';
import { InjectionToken } from '../../../injection.token';
import { Checking } from 'src/libs/checking';
import { HistoryService } from 'src/history/history.service';
import { CreateHistoryObject } from 'src/history/history.type';
import { History } from 'src/history/entity/history.orm-entity';

@CommandHandler(UpdateTaskCommand)
export class UpdateTaskHandler
  implements
    ICommandHandler<UpdateTaskCommand, Result<IdResponse, TaskNotFoundError>>
{
  constructor(
    @Inject(InjectionToken.TASK_REPOSITORY)
    private readonly taskRepository: TaskRepositoryPort,
    private readonly historyService: HistoryService,
  ) {}

  async execute(
    command: UpdateTaskCommand,
  ): Promise<Result<IdResponse, TaskNotFoundError>> {
    const task = await this.taskRepository.getOneById(
      command.taskId,
      command.requesterId,
    );
    if (Checking.isEmpty(task)) {
      return Err(new TaskNotFoundError());
    } else {
      task.edit(command.updateProperties);
      await this.taskRepository.save(task);
      const historyEntities: History[] = [];
      if (command.updateProperties.name) {
        const nameChangedHistoryObject: CreateHistoryObject = {
          userId: command.requesterId,
          taskId: task.id,
          action: 'UPDATE',
          message: 'updated the task name',
          changedContent: {
            old: task.getProperties().name,
            new: command.updateProperties.name,
          },
        };
        const nameChangedHistoryEntity = this.historyService.create(
          nameChangedHistoryObject,
        );
        historyEntities.push(nameChangedHistoryEntity);
      }
      if (command.updateProperties.priority) {
        const priorityChangedHistoryObject: CreateHistoryObject = {
          userId: command.requesterId,
          taskId: task.id,
          action: 'UPDATE',
          message: 'updated the task priority',
          changedContent: {
            old: task.getProperties().priority,
            new: command.updateProperties.priority,
          },
        };
        const priorityChangedHistoryEntity = this.historyService.create(
          priorityChangedHistoryObject,
        );
        historyEntities.push(priorityChangedHistoryEntity);
      }
      await this.historyService.save(historyEntities);
      return Ok(new IdResponse(command.taskId));
    }
  }
}
