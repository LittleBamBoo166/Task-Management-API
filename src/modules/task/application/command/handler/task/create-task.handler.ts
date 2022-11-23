import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTaskCommand } from '../../impl/task/create-task.command';
import { Result, Ok, Err } from 'oxide.ts';
import { IdResponse } from 'src/libs/dto/id.response.dto';
import { Inject } from '@nestjs/common';
import { InjectionToken } from '../../../injection.token';
import { TaskRepositoryPort } from 'src/modules/task/domain/database/task.repository.port';
import { ListRepositoryPort } from 'src/modules/board/domain/database/list.repository.port';
import { TaskFactory } from 'src/modules/task/domain/task.factory';
import { HistoryRepositoryPort } from 'src/libs/port/history.repository.port';
import { HistoryFactory } from 'src/libs/factory/history.factory';
import { Checking } from 'src/libs/util/checking';
import { ListNotFoundError } from 'src/modules/board/domain/error/list.error';

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
    @Inject(InjectionToken.HISTORY_REPOSITORY)
    private readonly historyRepository: HistoryRepositoryPort,
    private readonly historyFactory: HistoryFactory,
  ) {}

  async execute(
    command: CreateTaskCommand,
  ): Promise<Result<IdResponse, ListNotFoundError>> {
    const list = await this.listRepository.getOneById(
      command.listId,
      command.requester.id,
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
      const history = this.historyFactory.create({
        userId: command.requester.id,
        action: 'CREATE',
        createOn: new Date(),
        taskId: task.id,
        message: `${command.requester.name} CREATED TASK`,
        content: { ...command },
      });
      await this.historyRepository.save(history);
      return Ok(new IdResponse(task.id));
    }
  }
}
