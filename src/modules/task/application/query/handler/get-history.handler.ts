import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Err, Ok, Result } from 'oxide.ts';
import { Inject } from '@nestjs/common';
import { InjectionToken } from '../../injection.token';
import { GetHistoryQuery } from '../impl/get-history.query';
import { HistoryRepositoryPort } from 'src/libs/port/history.repository.port';
import { History } from 'src/infrastructure/entity/history.orm-entity';
import { TaskRepositoryPort } from 'src/modules/task/domain/database/task.repository.port';
import { TaskNotFoundError } from 'src/modules/task/domain/error/task.error';
import { Checking } from 'src/libs/util/checking';

@QueryHandler(GetHistoryQuery)
export class GetHistoryHandler
  implements
    IQueryHandler<GetHistoryQuery, Result<History[], TaskNotFoundError>>
{
  constructor(
    @Inject(InjectionToken.TASK_REPOSITORY)
    private readonly taskRepository: TaskRepositoryPort,
    @Inject(InjectionToken.HISTORY_REPOSITORY)
    private readonly historyRepository: HistoryRepositoryPort,
  ) {}

  async execute(
    query: GetHistoryQuery,
  ): Promise<Result<History[], TaskNotFoundError>> {
    const task = await this.taskRepository.getOneById(
      query.taskId,
      query.requester.id,
    );
    if (Checking.isEmpty(task)) {
      return Err(new TaskNotFoundError());
    } else {
      const history = await this.historyRepository.getTaskHistory(query.taskId);
      return Ok(history);
    }
  }
}
