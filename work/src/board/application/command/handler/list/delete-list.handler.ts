import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DeleteListCommand } from '../../impl/list/delete-list.command';
import { Result, Err, Ok } from 'oxide.ts';
import { IdResponse } from 'src/libs/id.response.dto';
import { BoardCannotAccessedError } from 'src/board/domain/error/board.error';
import { Inject } from '@nestjs/common';
import { InjectionToken } from '../../../injection.token';
import { ListRepositoryPort } from 'src/board/domain/database/list.repository.port';
import { BoardRepositoryPort } from 'src/board/domain/database/board.repository.port';
import { UserDeletedListEvent } from 'src/board/domain/event/user-deleted-list.event';
import { HistoryService } from 'src/history/history.service';
import { CreateHistoryObject } from 'src/history/history.type';

@CommandHandler(DeleteListCommand)
export class DeleteListHandler
  implements
    ICommandHandler<
      DeleteListCommand,
      Result<IdResponse, BoardCannotAccessedError>
    >
{
  constructor(
    @Inject(InjectionToken.LIST_REPOSITORY)
    private readonly listRepository: ListRepositoryPort,
    @Inject(InjectionToken.BOARD_REPOSITORY)
    private readonly boardRepository: BoardRepositoryPort,
    private readonly eventBus: EventBus,
    private readonly historyService: HistoryService,
  ) {}

  async execute(
    command: DeleteListCommand,
  ): Promise<Result<IdResponse, BoardCannotAccessedError>> {
    const isRequesterValid = await this.boardRepository.hasMember(
      command.boardId,
      command.requesterId,
    );
    if (isRequesterValid) {
      const list = await this.listRepository.getOneById(
        command.id,
        command.requesterId,
      );
      await this.listRepository.delete(command.id, command.boardId);
      this.eventBus.publish(
        new UserDeletedListEvent(command.id, command.requesterId),
      );
      const historyObject: CreateHistoryObject = {
        userId: command.requesterId,
        boardId: command.boardId,
        action: 'DELETE',
        message: 'deleted a list',
        changedContent: {
          id: command.id,
          name: list.getProperties().name,
        },
      };
      const historyEntity = this.historyService.create(historyObject);
      await this.historyService.save(historyEntity);
      return Ok(new IdResponse(command.id));
    } else {
      return Err(new BoardCannotAccessedError());
    }
  }
}
