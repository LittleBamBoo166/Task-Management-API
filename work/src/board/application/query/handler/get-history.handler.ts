import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Err, Ok, Result } from 'oxide.ts';
import { BoardCannotAccessedError } from 'src/board/domain/error/board.error';
import { Inject } from '@nestjs/common';
import { InjectionToken } from '../../injection.token';
import { BoardRepositoryPort } from 'src/board/domain/database/board.repository.port';
import { GetHistoryQuery } from '../impl/get-history.query';
import { HistoryService } from 'src/history/history.service';
import { History } from 'src/history/entity/history.orm-entity';

@QueryHandler(GetHistoryQuery)
export class GetHistoryHandler
  implements
    IQueryHandler<GetHistoryQuery, Result<History[], BoardCannotAccessedError>>
{
  constructor(
    @Inject(InjectionToken.BOARD_REPOSITORY)
    private readonly boardRepository: BoardRepositoryPort,
    private readonly historyService: HistoryService,
  ) {}

  async execute(
    query: GetHistoryQuery,
  ): Promise<Result<History[], BoardCannotAccessedError>> {
    const isRequesterValid = await this.boardRepository.hasMember(
      query.boardId,
      query.requesterId,
    );
    if (isRequesterValid) {
      const history = await this.historyService.getBoardHistory(query.boardId);
      return Ok(history);
    } else {
      return Err(new BoardCannotAccessedError());
    }
  }
}
