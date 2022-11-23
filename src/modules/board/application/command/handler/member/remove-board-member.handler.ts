import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result, Err, Ok } from 'oxide.ts';
import { IdResponse } from 'src/libs/dto/id.response.dto';
import { HistoryFactory } from 'src/libs/factory/history.factory';
import { HistoryRepositoryPort } from 'src/libs/port/history.repository.port';
import { BoardRepositoryPort } from 'src/modules/board/domain/database/board.repository.port';
import { MemberRepositoryPort } from 'src/modules/board/domain/database/member.repository.port';
import { BoardCannotAccessedError } from 'src/modules/board/domain/error/board.error';
import { MemberDoesNotExistError } from 'src/modules/board/domain/error/member.error';
import { InjectionToken } from '../../../injection.token';
import { RemoveBoardMemberCommand } from '../../impl/member/remove-board-member.command';

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
    @Inject(InjectionToken.HISTORY_REPOSITORY)
    private readonly historyRepository: HistoryRepositoryPort,
    private readonly historyFactory: HistoryFactory,
  ) {}

  async execute(
    command: RemoveBoardMemberCommand,
  ): Promise<
    Result<IdResponse, MemberDoesNotExistError | BoardCannotAccessedError>
  > {
    const isRequesterValid = await this.boardRepository.hasMember(
      command.boardId,
      command.requester.id,
    );
    if (isRequesterValid) {
      await this.memberRepository.delete(
        command.idMemberToRemove,
        command.boardId,
      );
      const history = this.historyFactory.create({
        userId: command.requester.id,
        action: 'REMOVE',
        createOn: new Date(),
        boardId: command.boardId,
        message: `${command.requester.name} REMOVED MEMBER`,
        content: { ...command },
      });
      await this.historyRepository.save(history);
      return Ok(new IdResponse(command.idMemberToRemove));
    } else {
      return Err(new BoardCannotAccessedError());
    }
  }
}
