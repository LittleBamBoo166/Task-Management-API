import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetBoardByIdQuery } from '../impl/get-board-by-id.query';
import { Err, Ok, Result } from 'oxide.ts';
import { BoardResponse } from 'src/modules/board/interface/dto/board.response';
import {
  BoardCannotAccessedError,
  BoardNotFoundError,
} from 'src/modules/board/domain/error/board.error';
import { Inject } from '@nestjs/common';
import { InjectionToken } from '../../injection.token';
import { BoardRepositoryPort } from 'src/modules/board/domain/database/board.repository.port';
import { Checking } from 'src/libs/util/checking';

@QueryHandler(GetBoardByIdQuery)
export class GetBoardByIdHandler
  implements
    IQueryHandler<
      GetBoardByIdQuery,
      Result<BoardResponse, BoardNotFoundError | BoardCannotAccessedError>
    >
{
  constructor(
    @Inject(InjectionToken.BOARD_REPOSITORY)
    private readonly boardRepository: BoardRepositoryPort,
  ) {}

  async execute(
    query: GetBoardByIdQuery,
  ): Promise<
    Result<BoardResponse, BoardNotFoundError | BoardCannotAccessedError>
  > {
    const hasMember = await this.boardRepository.hasMember(
      query.id,
      query.requesterId,
    );
    if (hasMember) {
      const board = await this.boardRepository.getDetailById(query.id);
      if (Checking.isEmpty(board)) {
        return Err(new BoardNotFoundError());
      }
      const boardProperties = board.getProperties();
      const response = new BoardResponse(
        boardProperties.id,
        boardProperties.name,
        boardProperties.description,
        boardProperties.ownerId,
        boardProperties.lists.map((list) => list.getProperties()),
        boardProperties.members.map((member) => member.getProperties()),
        boardProperties.labels.map((label) => label.getProperties()),
      );
      return Ok(response);
    } else {
      return Err(new BoardNotFoundError());
    }
  }
}
