import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DeleteListCommand } from '../../impl/list/delete-list.command';
import { Result, Err, Ok } from 'oxide.ts';
import { IdResponse } from 'src/libs/dto/id.response.dto';
import { BoardCannotAccessedError } from 'src/modules/board/domain/error/board.error';
import { Inject } from '@nestjs/common';
import { InjectionToken } from '../../../injection.token';
import { ListRepositoryPort } from 'src/modules/board/domain/database/list.repository.port';
import { BoardRepositoryPort } from 'src/modules/board/domain/database/board.repository.port';
import { UserDeletedListEvent } from 'src/modules/board/domain/event/user-deleted-list.event';
import { HistoryRepositoryPort } from 'src/libs/port/history.repository.port';
import { HistoryFactory } from 'src/libs/factory/history.factory';

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
    @Inject(InjectionToken.HISTORY_REPOSITORY)
    private readonly historyRepository: HistoryRepositoryPort,
    private readonly historyFactory: HistoryFactory,
  ) {}

  async execute(
    command: DeleteListCommand,
  ): Promise<Result<IdResponse, BoardCannotAccessedError>> {
    const isRequesterValid = await this.boardRepository.hasMember(
      command.boardId,
      command.requester.id,
    );
    if (isRequesterValid) {
      await this.listRepository.delete(command.id, command.boardId);
      this.eventBus.publish(
        new UserDeletedListEvent(command.id, command.requester.id),
      );
      const history = this.historyFactory.create({
        userId: command.requester.id,
        action: 'DELETE',
        createOn: new Date(),
        boardId: command.boardId,
        message: `${command.requester.name} DELETED LIST`,
        content: { ...command },
      });
      await this.historyRepository.save(history);
      return Ok(new IdResponse(command.id));
    } else {
      return Err(new BoardCannotAccessedError());
    }
  }
}
