import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DeleteBoardByIdCommand } from '../../impl/board/delete-board-by-id.command';
import { Result, Err, Ok } from 'oxide.ts';
import { IdResponse } from 'src/libs/id.response.dto';
import { BoardCannotAccessedError } from 'src/board/domain/error/board.error';
import { Inject } from '@nestjs/common';
import { InjectionToken } from '../../../injection.token';
import { BoardRepositoryPort } from 'src/board/domain/database/board.repository.port';
import { LabelRepositoryPort } from 'src/board/domain/database/label.repository.port';
import { ListRepositoryPort } from 'src/board/domain/database/list.repository.port';
import { MemberRepositoryPort } from 'src/board/domain/database/member.repository.port';
import { UserDeletedBoardEvent } from 'src/board/domain/event/user-deleted-board.event';
import { HistoryService } from 'src/history/history.service';
import { CreateHistoryObject } from 'src/history/history.type';

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
    private readonly historyService: HistoryService,
  ) {}

  async execute(
    command: DeleteBoardByIdCommand,
  ): Promise<Result<IdResponse, BoardCannotAccessedError>> {
    const isBoardOwner = await this.boardRepository.isBoardOwner(
      command.id,
      command.requesterId,
    );
    if (isBoardOwner) {
      await this.labelRepository.deleteMany('boardId', command.id);
      await this.listRepository.deleteMany('boardId', command.id);
      await this.memberRepository.deleteMany('boardId', command.id);
      await this.boardRepository.delete(command.id, command.requesterId);
      this.eventBus.publish(
        new UserDeletedBoardEvent(command.id, command.requesterId),
      );
      const historyObject: CreateHistoryObject = {
        userId: command.requesterId,
        boardId: command.id,
        action: 'DELETE',
        message: 'deleted the board',
      };
      const historyEntity = this.historyService.create(historyObject);
      await this.historyService.save(historyEntity);
      return Ok(new IdResponse(command.id));
    } else {
      return Err(new BoardCannotAccessedError());
    }
  }
}
