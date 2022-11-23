import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DeleteBoardByIdCommand } from '../../impl/board/delete-board-by-id.command';
import { Result, Err, Ok } from 'oxide.ts';
import { IdResponse } from 'src/libs/dto/id.response.dto';
import { BoardCannotAccessedError } from 'src/modules/board/domain/error/board.error';
import { Inject } from '@nestjs/common';
import { InjectionToken } from '../../../injection.token';
import { BoardRepositoryPort } from 'src/modules/board/domain/database/board.repository.port';
import { UserDeletedBoardEvent } from 'src/modules/board/domain/event/user-deleted-board.event';
import { LabelRepositoryPort } from 'src/modules/board/domain/database/label.repository.port';
import { ListRepositoryPort } from 'src/modules/board/domain/database/list.repository.port';
import { MemberRepositoryPort } from 'src/modules/board/domain/database/member.repository.port';
import { HistoryRepositoryPort } from 'src/libs/port/history.repository.port';
import { HistoryFactory } from 'src/libs/factory/history.factory';

@CommandHandler(DeleteBoardByIdCommand)
export class DeleteBoardByIdHandler
  implements
    ICommandHandler<
      DeleteBoardByIdCommand,
      Result<IdResponse, BoardCannotAccessedError>
    >
{
  constructor(
    @Inject(InjectionToken.BOARD_REPOSITORY)
    private readonly boardRepository: BoardRepositoryPort,
    @Inject(InjectionToken.LABEL_REPOSITORY)
    private readonly labelRepository: LabelRepositoryPort,
    @Inject(InjectionToken.LIST_REPOSITORY)
    private readonly listRepository: ListRepositoryPort,
    @Inject(InjectionToken.MEMBER_REPOSITORY)
    private readonly memberRepository: MemberRepositoryPort,
    private readonly eventBus: EventBus,
    @Inject(InjectionToken.HISTORY_REPOSITORY)
    private historyRepository: HistoryRepositoryPort,
    private readonly historyFactory: HistoryFactory,
  ) {}

  async execute(
    command: DeleteBoardByIdCommand,
  ): Promise<Result<IdResponse, BoardCannotAccessedError>> {
    const isBoardOwner = await this.boardRepository.isBoardOwner(
      command.id,
      command.requester.id,
    );
    if (isBoardOwner) {
      await this.labelRepository.deleteMany('boardId', command.id);
      await this.listRepository.deleteMany('boardId', command.id);
      await this.memberRepository.deleteMany('boardId', command.id);
      await this.boardRepository.delete(command.id, command.requester.id);
      const history = this.historyFactory.create({
        userId: command.requester.id,
        createOn: new Date(),
        action: 'DELETE',
        message: `${command.requester.name} deleted board`,
        boardId: command.id,
      });
      await this.historyRepository.save(history);
      this.eventBus.publish(
        new UserDeletedBoardEvent(command.id, command.requester.id),
      );
      return Ok(new IdResponse(command.id));
    } else {
      return Err(new BoardCannotAccessedError());
    }
  }
}
