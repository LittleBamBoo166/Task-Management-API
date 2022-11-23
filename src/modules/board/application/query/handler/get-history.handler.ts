import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Err, Ok, Result } from 'oxide.ts';
import { BoardCannotAccessedError } from 'src/modules/board/domain/error/board.error';
import { Inject } from '@nestjs/common';
import { InjectionToken } from '../../injection.token';
import { BoardRepositoryPort } from 'src/modules/board/domain/database/board.repository.port';
import { GetHistoryQuery } from '../impl/get-history.query';
import { HistoryRepositoryPort } from 'src/libs/port/history.repository.port';
import { History } from 'src/infrastructure/entity/history.orm-entity';

@QueryHandler(GetHistoryQuery)
export class GetHistoryHandler
  implements
    IQueryHandler<GetHistoryQuery, Result<History[], BoardCannotAccessedError>>
{
  constructor(
    @Inject(InjectionToken.BOARD_REPOSITORY)
    private readonly boardRepository: BoardRepositoryPort,
    @Inject(InjectionToken.HISTORY_REPOSITORY)
    private readonly historyRepository: HistoryRepositoryPort,
  ) {}

  async execute(
    query: GetHistoryQuery,
  ): Promise<Result<History[], BoardCannotAccessedError>> {
    const isRequesterValid = await this.boardRepository.hasMember(
      query.boardId,
      query.requester.id,
    );
    if (isRequesterValid) {
      const history = await this.historyRepository.getBoardHistory(
        query.boardId,
      );
      return Ok(history);
    } else {
      return Err(new BoardCannotAccessedError());
    }
  }
}
