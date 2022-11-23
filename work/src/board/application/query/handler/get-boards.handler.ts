import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetBoardsQuery } from '../impl/get-boards.query';
import { Err, Ok, Result } from 'oxide.ts';
import { BoardResponse } from 'src/board/interface/dto/board.response';
import { BoardNotFoundError } from 'src/board/domain/error/board.error';
import { Inject } from '@nestjs/common';
import { InjectionToken } from '../../injection.token';
import { BoardRepositoryPort } from 'src/board/domain/database/board.repository.port';

@QueryHandler(GetBoardsQuery)
export class GetBoardsHandler
  implements
    IQueryHandler<GetBoardsQuery, Result<BoardResponse[], BoardNotFoundError>>
{
  constructor(
    @Inject(InjectionToken.BOARD_REPOSITORY)
    private readonly boardRepository: BoardRepositoryPort,
  ) {}

  async execute(
    query: GetBoardsQuery,
  ): Promise<Result<BoardResponse[], BoardNotFoundError>> {
    const boards = await this.boardRepository.getByMember(query.ownerId);
    if (boards.length === 0 || !boards.length) {
      return Err(new BoardNotFoundError());
    }
    const boardResponses = boards.map((board) => {
      const properties = board.getProperties();
      return new BoardResponse(
        properties.id,
        properties.name,
        properties.description,
      );
    });
    return Ok(boardResponses);
  }
}
