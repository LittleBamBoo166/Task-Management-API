import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateBoardCommand } from '../../impl/board/update-board.command';
import { Result, Err, Ok } from 'oxide.ts';
import { IdResponse } from 'src/libs/dto/id.response.dto';
import {
  BoardAlreadyExistError,
  BoardNotFoundError,
} from 'src/modules/board/domain/error/board.error';
import { Inject } from '@nestjs/common';
import { InjectionToken } from '../../../injection.token';
import { BoardRepositoryPort } from 'src/modules/board/domain/database/board.repository.port';
import { Checking } from 'src/libs/util/checking';
import { ArgumentNotProvideException } from 'src/libs/exception/argument-not-provide.exception';
import { HistoryRepositoryPort } from 'src/libs/port/history.repository.port';
import { HistoryFactory } from 'src/libs/factory/history.factory';

@CommandHandler(UpdateBoardCommand)
export class UpdateBoardHandler
  implements
    ICommandHandler<
      UpdateBoardCommand,
      Result<
        IdResponse,
        | BoardNotFoundError
        | ArgumentNotProvideException
        | BoardAlreadyExistError
      >
    >
{
  constructor(
    @Inject(InjectionToken.BOARD_REPOSITORY)
    private readonly boardRepository: BoardRepositoryPort,
    @Inject(InjectionToken.HISTORY_REPOSITORY)
    private historyRepository: HistoryRepositoryPort,
    private readonly historyFactory: HistoryFactory,
  ) {}

  async execute(
    command: UpdateBoardCommand,
  ): Promise<
    Result<
      IdResponse,
      BoardNotFoundError | ArgumentNotProvideException | BoardAlreadyExistError
    >
  > {
    const isArgumentProvided =
      !Checking.isEmpty(command.name) || !Checking.isEmpty(command.description);
    if (isArgumentProvided) {
      const board = await this.boardRepository.getOneById(
        command.id,
        command.requester.id,
      );
      if (Checking.isEmpty(board)) {
        return Err(new BoardNotFoundError());
      } else {
        const isNameValid =
          !Checking.isEmpty(command.name) &&
          !(await this.boardRepository.exists(
            command.name,
            command.requester.id,
          ));
        if (isNameValid) {
          board.edit({ ...command });
          await this.boardRepository.save(board);
          const history = this.historyFactory.create({
            userId: command.requester.id,
            createOn: new Date(),
            action: 'UPDATE',
            message: `${command.requester.name} update board`,
            content: { ...command },
            boardId: command.id,
          });
          await this.historyRepository.save(history);
          const response = new IdResponse(command.id);
          return Ok(response);
        } else {
          return Err(new BoardAlreadyExistError());
        }
      }
    } else {
      return Err(new ArgumentNotProvideException());
    }
  }
}
