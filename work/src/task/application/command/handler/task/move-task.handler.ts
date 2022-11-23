import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result, Ok, Err } from 'oxide.ts';
import { IdResponse } from 'src/libs/id.response.dto';
import {
  CannotMoveTaskError,
  TaskNotFoundError,
} from 'src/task/domain/error/task.error';
import { Inject } from '@nestjs/common';
import { ListRepositoryPort } from 'src/board/domain/database/list.repository.port';
import { TaskRepositoryPort } from 'src/task/domain/database/task.repository.port';
import { InjectionToken } from '../../../injection.token';
import { Checking } from 'src/libs/checking';
import { MoveTaskCommand } from '../../impl/task/move-task.command';

@CommandHandler(MoveTaskCommand)
export class MoveTaskHandler
  implements
    ICommandHandler<
      MoveTaskCommand,
      Result<IdResponse, TaskNotFoundError | CannotMoveTaskError>
    >
{
  constructor(
    @Inject(InjectionToken.TASK_REPOSITORY)
    private readonly taskRepository: TaskRepositoryPort,
    @Inject(InjectionToken.LIST_REPOSITORY)
    private readonly listRepository: ListRepositoryPort,
  ) {}

  async execute(
    command: MoveTaskCommand,
  ): Promise<Result<IdResponse, TaskNotFoundError | CannotMoveTaskError>> {
    const task = await this.taskRepository.getOneById(
      command.id,
      command.requesterId,
    );
    if (Checking.isEmpty(task)) {
      return Err(new TaskNotFoundError());
    } else {
      let isListValid: boolean;
      if (Checking.isEmpty(command.listId)) {
        isListValid = true;
      } else {
        isListValid = await this.listRepository.inTheSameBoard(
          task.getProperties().listId,
          command.listId,
        );
      }
      if (isListValid) {
        task.move(command.listId, command.order);
        await this.taskRepository.save(task);
        return Ok(new IdResponse(command.id));
      } else {
        return Err(new CannotMoveTaskError());
      }
    }
  }
}
