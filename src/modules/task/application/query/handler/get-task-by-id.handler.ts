import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTaskByIdQuery } from '../impl/get-task-by-id.query';
import { Result, Ok, Err } from 'oxide.ts';
import { TaskNotFoundError } from 'src/modules/task/domain/error/task.error';
import { Inject } from '@nestjs/common';
import { InjectionToken } from '../../injection.token';
import { TaskRepositoryPort } from 'src/modules/task/domain/database/task.repository.port';
import { Checking } from 'src/libs/util/checking';
import { TaskResponseWithDetail } from 'src/modules/task/interface/dto/task.response-with-detail';

@QueryHandler(GetTaskByIdQuery)
export class GetTaskByIdHandler
  implements
    IQueryHandler<
      GetTaskByIdQuery,
      Result<TaskResponseWithDetail, TaskNotFoundError>
    >
{
  constructor(
    @Inject(InjectionToken.TASK_REPOSITORY)
    private readonly taskRepository: TaskRepositoryPort,
  ) {}

  async execute(
    query: GetTaskByIdQuery,
  ): Promise<Result<TaskResponseWithDetail, TaskNotFoundError>> {
    const task = await this.taskRepository.getOneByIdWithDetail(
      query.id,
      query.requesterId,
    );
    if (Checking.isEmpty(task)) {
      return Err(new TaskNotFoundError());
    } else {
      const taskProperties = task.getProperties();
      const response: TaskResponseWithDetail = {
        ...taskProperties,
        attachments:
          taskProperties.attachments &&
          taskProperties.attachments.map((attachment) =>
            attachment.getProperties(),
          ),
        comments:
          taskProperties.comments &&
          taskProperties.comments.map((comment) => comment.getProperties()),
        todos:
          taskProperties.todos &&
          taskProperties.todos.map((todo) => todo.getProperties()),
      };
      return Ok(response);
    }
  }
}
