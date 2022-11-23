import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateListCommand } from '../../impl/list/update-list.command';
import { Result, Err, Ok } from 'oxide.ts';
import { IdResponse } from 'src/libs/dto/id.response.dto';
import {
  ListAlreadyExistError,
  ListNotFoundError,
} from 'src/modules/board/domain/error/list.error';
import { ArgumentNotProvideException } from 'src/libs/exception/argument-not-provide.exception';
import { Inject } from '@nestjs/common';
import { InjectionToken } from '../../../injection.token';
import { ListRepositoryPort } from 'src/modules/board/domain/database/list.repository.port';
import { Checking } from 'src/libs/util/checking';
import { BoardCannotAccessedError } from 'src/modules/board/domain/error/board.error';
import { HistoryRepositoryPort } from 'src/libs/port/history.repository.port';
import { HistoryFactory } from 'src/libs/factory/history.factory';

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
    @Inject(InjectionToken.HISTORY_REPOSITORY)
    private readonly historyRepository: HistoryRepositoryPort,
    private readonly historyFactory: HistoryFactory,
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
      command.requester.id,
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
          const history = this.historyFactory.create({
            userId: command.requester.id,
            action: 'UPDATE',
            createOn: new Date(),
            boardId: command.boardId,
            message: `${command.requester.name} UPDATED LIST`,
            content: { ...command },
          });
          await this.historyRepository.save(history);
          return Ok(new IdResponse(command.id));
        }
      } else {
        return Err(new ArgumentNotProvideException());
      }
    }
  }
}
