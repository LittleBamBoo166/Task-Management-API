import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateTaskCommand } from '../../impl/task/update-task.command';
import { Result, Ok, Err } from 'oxide.ts';
import { IdResponse } from 'src/libs/dto/id.response.dto';
import { TaskNotFoundError } from 'src/modules/task/domain/error/task.error';
import { Inject } from '@nestjs/common';
import { TaskRepositoryPort } from 'src/modules/task/domain/database/task.repository.port';
import { InjectionToken } from '../../../injection.token';
import { Checking } from 'src/libs/util/checking';
import { HistoryRepositoryPort } from 'src/libs/port/history.repository.port';
import { HistoryFactory } from 'src/libs/factory/history.factory';

@CommandHandler(UpdateTaskCommand)
export class UpdateTaskHandler
  implements
    ICommandHandler<UpdateTaskCommand, Result<IdResponse, TaskNotFoundError>>
{
  constructor(
    @Inject(InjectionToken.TASK_REPOSITORY)
    private readonly taskRepository: TaskRepositoryPort,
    @Inject(InjectionToken.HISTORY_REPOSITORY)
    private readonly historyRepository: HistoryRepositoryPort,
    private readonly historyFactory: HistoryFactory,
  ) {}

  async execute(
    command: UpdateTaskCommand,
  ): Promise<Result<IdResponse, TaskNotFoundError>> {
    const task = await this.taskRepository.getOneById(
      command.taskId,
      command.requester.id,
    );
    if (Checking.isEmpty(task)) {
      return Err(new TaskNotFoundError());
    } else {
      task.edit(command.updateProperties);
      await this.taskRepository.save(task);
      const history = this.historyFactory.create({
        userId: command.requester.id,
        action: 'UPDATE',
        createOn: new Date(),
        taskId: command.taskId,
        message: `${command.requester.name} UPDATED TASK`,
        content: { ...command },
      });
      await this.historyRepository.save(history);
      return Ok(new IdResponse(command.taskId));
    }
  }
}
