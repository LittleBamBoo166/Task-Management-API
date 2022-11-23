import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateBoardCommand } from '../../impl/board/update-board.command';
import { Result, Err, Ok } from 'oxide.ts';
import { IdResponse } from 'src/libs/id.response.dto';
import {
  BoardAlreadyExistError,
  BoardNotFoundError,
} from 'src/board/domain/error/board.error';
import { Inject } from '@nestjs/common';
import { InjectionToken } from '../../../injection.token';
import { BoardRepositoryPort } from 'src/board/domain/database/board.repository.port';
import { Checking } from 'src/libs/checking';
import { ArgumentNotProvideException } from 'src/libs/argument-not-provide.exception';
import { HistoryService } from 'src/history/history.service';
import { CreateHistoryObject } from 'src/history/history.type';
import { History } from 'src/history/entity/history.orm-entity';

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
    private readonly historyService: HistoryService,
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
        command.requesterId,
      );
      if (Checking.isEmpty(board)) {
        return Err(new BoardNotFoundError());
      } else {
        const isNameValid =
          Checking.isEmpty(command.name) ||
          !(await this.boardRepository.exists(
            command.name,
            command.requesterId,
          ));
        if (isNameValid) {
          const historyEntities: History[] = [];
          if (command.name) {
            const nameChangedHistoryObject: CreateHistoryObject = {
              userId: command.requesterId,
              boardId: board.id,
              action: 'UPDATE',
              message: 'updated the board name',
              changedContent: {
                old: board.getProperties().name,
                new: command.name,
              },
            };
            const nameChangedHistoryEntity = this.historyService.create(
              nameChangedHistoryObject,
            );
            historyEntities.push(nameChangedHistoryEntity);
          }
          if (command.description) {
            const descriptionChangedHistoryObject: CreateHistoryObject = {
              userId: command.requesterId,
              boardId: board.id,
              action: 'UPDATE',
              message: 'updated the board description',
              changedContent: {
                old: board.getProperties().description,
                new: command.description,
              },
            };
            const descriptionChangedHistoryEntity = this.historyService.create(
              descriptionChangedHistoryObject,
            );
            historyEntities.push(descriptionChangedHistoryEntity);
          }
          await this.historyService.save(historyEntities);
          board.edit({ ...command });
          await this.boardRepository.save(board);
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
