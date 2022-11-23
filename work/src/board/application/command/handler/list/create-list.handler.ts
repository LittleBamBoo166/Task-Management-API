import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateListCommand } from '../../impl/list/create-list.command';
import { Result, Err, Ok } from 'oxide.ts';
import { IdResponse } from 'src/libs/id.response.dto';
import { ListAlreadyExistError } from 'src/board/domain/error/list.error';
import { Inject } from '@nestjs/common';
import { InjectionToken } from '../../../injection.token';
import { ListRepositoryPort } from 'src/board/domain/database/list.repository.port';
import { ListFactory } from 'src/board/domain/list.factory';
import { BoardRepositoryPort } from 'src/board/domain/database/board.repository.port';
import { BoardCannotAccessedError } from 'src/board/domain/error/board.error';
import { HistoryService } from 'src/history/history.service';
import { CreateHistoryObject } from 'src/history/history.type';

@CommandHandler(CreateListCommand)
export class CreateListHandler
  implements
    ICommandHandler<
      CreateListCommand,
      Result<IdResponse, ListAlreadyExistError | BoardCannotAccessedError>
    >
{
  constructor(
    @Inject(InjectionToken.LIST_REPOSITORY)
    private listRepository: ListRepositoryPort,
    @Inject(InjectionToken.BOARD_REPOSITORY)
    private boardRepository: BoardRepositoryPort,
    private readonly listFactory: ListFactory,
    private readonly historyService: HistoryService,
  ) {}

  async execute(
    command: CreateListCommand,
  ): Promise<
    Result<IdResponse, ListAlreadyExistError | BoardCannotAccessedError>
  > {
    const isRequesterValid = await this.boardRepository.hasMember(
      command.boardId,
      command.requesterId,
    );
    if (isRequesterValid) {
      const hasLists = await this.listRepository.exists(
        command.name,
        command.boardId,
      );
      if (hasLists) {
        return Err(new ListAlreadyExistError());
      } else {
        const list = this.listFactory.create(
          command.name,
          command.color,
          command.order,
        );
        await this.listRepository.save(list, command.boardId);
        const historyObject: CreateHistoryObject = {
          userId: command.requesterId,
          boardId: command.boardId,
          action: 'CREATE',
          message: 'created a new list',
          changedContent: {
            id: list.getProperties().id,
            name: command.name,
          },
        };
        const historyEntity = this.historyService.create(historyObject);
        await this.historyService.save(historyEntity);
        return Ok(new IdResponse(list.getProperties().id));
      }
    } else {
      return Err(new BoardCannotAccessedError());
    }
  }
}
