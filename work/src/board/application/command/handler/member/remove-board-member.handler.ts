import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result, Err, Ok } from 'oxide.ts';
import { IdResponse } from 'src/libs/id.response.dto';
import { BoardRepositoryPort } from 'src/board/domain/database/board.repository.port';
import { MemberRepositoryPort } from 'src/board/domain/database/member.repository.port';
import { BoardCannotAccessedError } from 'src/board/domain/error/board.error';
import { MemberDoesNotExistError } from 'src/board/domain/error/member.error';
import { InjectionToken } from '../../../injection.token';
import { RemoveBoardMemberCommand } from '../../impl/member/remove-board-member.command';
import { HistoryService } from 'src/history/history.service';
import { CreateHistoryObject } from 'src/history/history.type';

@CommandHandler(RemoveBoardMemberCommand)
export class RemoveBoardMemberHandler
  implements
    ICommandHandler<
      RemoveBoardMemberCommand,
      Result<IdResponse, MemberDoesNotExistError | BoardCannotAccessedError>
    >
{
  constructor(
    @Inject(InjectionToken.MEMBER_REPOSITORY)
    private readonly memberRepository: MemberRepositoryPort,
    @Inject(InjectionToken.BOARD_REPOSITORY)
    private readonly boardRepository: BoardRepositoryPort,
    private readonly historyService: HistoryService,
  ) {}

  async execute(
    command: RemoveBoardMemberCommand,
  ): Promise<
    Result<IdResponse, MemberDoesNotExistError | BoardCannotAccessedError>
  > {
    const isRequesterValid = await this.boardRepository.hasMember(
      command.boardId,
      command.requesterId,
    );
    if (isRequesterValid) {
      await this.memberRepository.delete(
        command.idMemberToRemove,
        command.boardId,
      );
      const historyObject: CreateHistoryObject = {
        userId: command.requesterId,
        boardId: command.boardId,
        action: 'REMOVE',
        message: 'removed a member from the board',
        changedContent: {
          id: command.idMemberToRemove,
        },
      };
      const historyEntity = this.historyService.create(historyObject);
      await this.historyService.save(historyEntity);
      return Ok(new IdResponse(command.idMemberToRemove));
    } else {
      return Err(new BoardCannotAccessedError());
    }
  }
}
