import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateBoardCommand } from '../../impl/board/create-board.command';
import { Result, Err, Ok } from 'oxide.ts';
import { IdResponse } from 'src/libs/dto/id.response.dto';
import { Inject } from '@nestjs/common';
import { InjectionToken } from '../../../injection.token';
import { BoardRepositoryPort } from 'src/modules/board/domain/database/board.repository.port';
import { BoardFactory } from 'src/modules/board/domain/board.factory';
import { BoardAlreadyExistError } from 'src/modules/board/domain/error/board.error';
import { HistoryRepositoryPort } from 'src/libs/port/history.repository.port';
import { HistoryFactory } from 'src/libs/factory/history.factory';

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
    @Inject(InjectionToken.HISTORY_REPOSITORY)
    private historyRepository: HistoryRepositoryPort,
    private readonly historyFactory: HistoryFactory,
  ) {}

  async execute(
    command: CreateBoardCommand,
  ): Promise<Result<IdResponse, BoardAlreadyExistError>> {
    const hasBoards = await this.boardRepository.exists(
      command.boardName,
      command.owner.id,
    );
    if (hasBoards) {
      return Err(new BoardAlreadyExistError());
    } else {
      const board = this.boardFactory.create(
        command.boardName,
        command.owner.id,
        command.description,
      );
      await this.boardRepository.save(board);
      board.commit();
      const history = this.historyFactory.create({
        userId: command.owner.id,
        createOn: new Date(),
        action: 'CREATE',
        message: `${command.owner.name} created board`,
        content: { ...command },
        boardId: board.id,
      });
      await this.historyRepository.save(history);
      return Ok(new IdResponse(board.id));
    }
  }
}
