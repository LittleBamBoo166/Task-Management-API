import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTaskByIdQuery } from '../impl/get-task-by-id.query';
import { Result, Ok, Err } from 'oxide.ts';
import { TaskNotFoundError } from 'src/task/domain/error/task.error';
import { Inject } from '@nestjs/common';
import { InjectionToken } from '../../injection.token';
import { TaskRepositoryPort } from 'src/task/domain/database/task.repository.port';
import { Checking } from 'src/libs/checking';
import { Task } from 'src/task/infrastructure/entity/task.orm-entity';

@QueryHandler(GetTaskByIdQuery)
export class GetTaskByIdHandler
  implements IQueryHandler<GetTaskByIdQuery, Result<Task, TaskNotFoundError>>
{
  constructor(
    @Inject(InjectionToken.TASK_REPOSITORY)
    private readonly taskRepository: TaskRepositoryPort,
  ) {}

  async execute(
    query: GetTaskByIdQuery,
  ): Promise<Result<Task, TaskNotFoundError>> {
    const task = await this.taskRepository.getOneByIdWithDetail(
      query.id,
      query.requesterId,
    );
    if (Checking.isEmpty(task)) {
      return Err(new TaskNotFoundError());
    } else {
      return Ok(task);
    }
  }
}
