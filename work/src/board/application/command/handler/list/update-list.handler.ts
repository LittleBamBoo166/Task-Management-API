import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateListCommand } from '../../impl/list/update-list.command';
import { Result, Err, Ok } from 'oxide.ts';
import { IdResponse } from 'src/libs/id.response.dto';
import {
  ListAlreadyExistError,
  ListNotFoundError,
} from 'src/board/domain/error/list.error';
import { ArgumentNotProvideException } from 'src/libs/argument-not-provide.exception';
import { Inject } from '@nestjs/common';
import { InjectionToken } from '../../../injection.token';
import { ListRepositoryPort } from 'src/board/domain/database/list.repository.port';
import { Checking } from 'src/libs/checking';
import { BoardCannotAccessedError } from 'src/board/domain/error/board.error';
import { HistoryService } from 'src/history/history.service';
import { CreateHistoryObject } from 'src/history/history.type';

@CommandHandler(UpdateListCommand)
export class UpdateListHandler
  implements
    ICommandHandler<
      UpdateListCommand,
      Result<
        IdResponse,
        | ListNotFoundError
        | ArgumentNotProvideException
        | BoardCannotAccessedError
        | ListAlreadyExistError
      >
    >
{
  constructor(
    @Inject(InjectionToken.LIST_REPOSITORY)
    private readonly listRepository: ListRepositoryPort,
    private readonly historyService: HistoryService,
  ) {}

  async execute(
    command: UpdateListCommand,
  ): Promise<
    Result<
      IdResponse,
      | ListNotFoundError
      | ArgumentNotProvideException
      | BoardCannotAccessedError
      | ListAlreadyExistError
    >
  > {
    const list = await this.listRepository.getOneById(
      command.id,
      command.requesterId,
      command.boardId,
    );
    if (Checking.isEmpty(list)) {
      return Err(new ListNotFoundError());
    } else {
      const isArgumentsProvided =
        !Checking.isEmpty(command.name) ||
        !Checking.isEmpty(command.color) ||
        !Checking.isEmpty(command.order);
      if (isArgumentsProvided) {
        const isListNameExist =
          !Checking.isEmpty(command.name) &&
          (await this.listRepository.exists(command.name, command.boardId));
        if (isListNameExist) {
          return Err(new ListAlreadyExistError());
        } else {
          list.edit({ ...command });
          await this.listRepository.save(list, command.boardId);
          if (command.name) {
            const historyObject: CreateHistoryObject = {
              userId: command.requesterId,
              boardId: command.boardId,
              action: 'DELETE',
              message: 'deleted a list',
              changedContent: {
                id: command.id,
                old: list.getProperties().name,
                new: command.name,
              },
            };
            const historyEntity = this.historyService.create(historyObject);
            await this.historyService.save(historyEntity);
          }
          return Ok(new IdResponse(command.id));
        }
      } else {
        return Err(new ArgumentNotProvideException());
      }
    }
  }
}
