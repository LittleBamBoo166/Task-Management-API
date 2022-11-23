import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTaskByListIdQuery } from '../impl/get-tasks-by-board-id.query';
import { Result, Ok, Err } from 'oxide.ts';
import { TaskResponse } from 'src/task/interface/dto/task.response';
import { TaskRepositoryPort } from 'src/task/domain/database/task.repository.port';
import { TaskNotFoundError } from 'src/task/domain/error/task.error';
import { Inject } from '@nestjs/common';
import { InjectionToken } from '../../injection.token';
import { Checking } from 'src/libs/checking';
import { ListRepositoryPort } from 'src/board/domain/database/list.repository.port';
import { ListNotFoundError } from 'src/board/domain/error/list.error';

@QueryHandler(GetTaskByListIdQuery)
export class GetTaskByListIdHandler
  implements
    IQueryHandler<
      GetTaskByListIdQuery,
      Result<TaskResponse[], TaskNotFoundError | ListNotFoundError>
    >
{
  constructor(
    @Inject(InjectionToken.TASK_REPOSITORY)
    private readonly taskRepository: TaskRepositoryPort,
    @Inject(InjectionToken.LIST_REPOSITORY)
    private readonly listRepository: ListRepositoryPort,
  ) {}

  async execute(
    query: GetTaskByListIdQuery,
  ): Promise<Result<TaskResponse[], TaskNotFoundError | ListNotFoundError>> {
    const list = await this.listRepository.getOneById(
      query.listId,
      query.requesterId,
    );
    if (Checking.isEmpty(list)) {
      return Err(new ListNotFoundError());
    } else {
      const tasks = await this.taskRepository.findByListId(query.listId);
      if (Checking.isEmpty(tasks)) {
        return Err(new TaskNotFoundError());
      } else {
        const taskPropertiesArray = tasks.map((task) => task.getProperties());
        const response: TaskResponse[] = taskPropertiesArray.map(
          (properties) => new TaskResponse(properties),
        );
        return Ok(response);
      }
    }
  }
}
