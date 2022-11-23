import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateBoardCommand } from '../../impl/board/create-board.command';
import { Result, Err, Ok } from 'oxide.ts';
import { IdResponse } from 'src/libs/id.response.dto';
import { Inject } from '@nestjs/common';
import { InjectionToken } from '../../../injection.token';
import { BoardRepositoryPort } from 'src/board/domain/database/board.repository.port';
import { BoardFactory } from 'src/board/domain/board.factory';
import { BoardAlreadyExistError } from 'src/board/domain/error/board.error';
import { HistoryService } from 'src/history/history.service';
import { CreateHistoryObject } from 'src/history/history.type';

@CommandHandler(CreateBoardCommand)
export class CreateBoardHandler
  implements
    ICommandHandler<
      CreateBoardCommand,
      Result<IdResponse, BoardAlreadyExistError>
    >
{
  constructor(
    @Inject(InjectionToken.BOARD_REPOSITORY)
    private boardRepository: BoardRepositoryPort,
    private readonly boardFactory: BoardFactory,
    private readonly historyServie: HistoryService,
  ) {}

  async execute(
    command: CreateBoardCommand,
  ): Promise<Result<IdResponse, BoardAlreadyExistError>> {
    const hasBoards = await this.boardRepository.exists(
      command.boardName,
      command.ownerId,
    );
    if (hasBoards) {
      return Err(new BoardAlreadyExistError());
    } else {
      const board = this.boardFactory.create(
        command.boardName,
        command.ownerId,
        command.description,
      );
      await this.boardRepository.save(board);
      board.commit();
      const historyObject: CreateHistoryObject = {
        userId: command.ownerId,
        boardId: board.id,
        action: 'CREATE',
        message: 'created a new board',
        changedContent: {
          name: command.boardName,
          description: command.description ? command.description : null,
        },
      };
      const historyEntity = this.historyServie.create(historyObject);
      await this.historyServie.save(historyEntity);
      return Ok(new IdResponse(board.id));
    }
  }
}
