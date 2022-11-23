import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Err, Ok, Result } from 'oxide.ts';
import { Inject } from '@nestjs/common';
import { InjectionToken } from '../../injection.token';
import { GetHistoryQuery } from '../impl/get-history.query';
import { TaskRepositoryPort } from 'src/task/domain/database/task.repository.port';
import { TaskNotFoundError } from 'src/task/domain/error/task.error';
import { Checking } from 'src/libs/checking';
import { HistoryService } from 'src/history/history.service';
import { History } from 'src/history/entity/history.orm-entity';

@QueryHandler(GetHistoryQuery)
export class GetHistoryHandler
  implements
    IQueryHandler<GetHistoryQuery, Result<History[], TaskNotFoundError>>
{
  constructor(
    @Inject(InjectionToken.TASK_REPOSITORY)
    private readonly taskRepository: TaskRepositoryPort,
    private readonly historyService: HistoryService,
  ) {}

  async execute(
    query: GetHistoryQuery,
  ): Promise<Result<History[], TaskNotFoundError>> {
    const task = await this.taskRepository.getOneById(
      query.taskId,
      query.requesterId,
    );
    if (Checking.isEmpty(task)) {
      return Err(new TaskNotFoundError());
    } else {
      const history = await this.historyService.getTaskHistory(query.taskId);
      return Ok(history);
    }
  }
}
