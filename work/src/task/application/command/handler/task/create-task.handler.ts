import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTaskCommand } from '../../impl/task/create-task.command';
import { Result, Ok, Err } from 'oxide.ts';
import { IdResponse } from 'src/libs/id.response.dto';
import { Inject } from '@nestjs/common';
import { InjectionToken } from '../../../injection.token';
import { TaskRepositoryPort } from 'src/task/domain/database/task.repository.port';
import { ListRepositoryPort } from 'src/board/domain/database/list.repository.port';
import { TaskFactory } from 'src/task/domain/task.factory';
import { Checking } from 'src/libs/checking';
import { ListNotFoundError } from 'src/board/domain/error/list.error';
import { HistoryService } from 'src/history/history.service';
import { CreateHistoryObject } from 'src/history/history.type';

@CommandHandler(CreateTaskCommand)
export class CreateTaskHandler
  implements
    ICommandHandler<CreateTaskCommand, Result<IdResponse, ListNotFoundError>>
{
  constructor(
    @Inject(InjectionToken.TASK_REPOSITORY)
    private readonly taskRepository: TaskRepositoryPort,
    @Inject(InjectionToken.LIST_REPOSITORY)
    private readonly listRepository: ListRepositoryPort,
    private readonly taskFactory: TaskFactory,
    private readonly historyService: HistoryService,
  ) {}

  async execute(
    command: CreateTaskCommand,
  ): Promise<Result<IdResponse, ListNotFoundError>> {
    const list = await this.listRepository.getOneById(
      command.listId,
      command.requesterId,
    );
    if (Checking.isEmpty(list)) {
      return Err(new ListNotFoundError());
    } else {
      const task = this.taskFactory.create(
        command.name,
        command.listId,
        command.dueDate,
        command.priority,
        command.order,
      );
      await this.taskRepository.save(task);
      const historyObject: CreateHistoryObject = {
        userId: command.requesterId,
        taskId: task.id,
        action: 'CREATE',
        message: 'created a new task',
        changedContent: {
          name: command.name,
        },
      };
      const historyEntity = this.historyService.create(historyObject);
      await this.historyService.save(historyEntity);
      return Ok(new IdResponse(task.id));
    }
  }
}
