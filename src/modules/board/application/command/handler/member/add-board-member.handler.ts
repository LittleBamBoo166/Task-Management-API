import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddBoardMemberCommand } from '../../impl/member/add-board-member.command';
import { Result, Err, Ok } from 'oxide.ts';
import { IdResponse } from 'src/libs/dto/id.response.dto';
import { MemberAlreadyExistError } from 'src/modules/board/domain/error/member.error';
import { Inject } from '@nestjs/common';
import { InjectionToken } from '../../../injection.token';
import { MemberRepositoryPort } from 'src/modules/board/domain/database/member.repository.port';
import { MemberFactory } from 'src/modules/board/domain/member.factory';
import { BoardRepositoryPort } from 'src/modules/board/domain/database/board.repository.port';
import { BoardCannotAccessedError } from 'src/modules/board/domain/error/board.error';
import { HistoryRepositoryPort } from 'src/libs/port/history.repository.port';
import { HistoryFactory } from 'src/libs/factory/history.factory';

@CommandHandler(AddBoardMemberCommand)
export class AddBoardMemberHandler
  implements
    ICommandHandler<
      AddBoardMemberCommand,
      Result<IdResponse, MemberAlreadyExistError | BoardCannotAccessedError>
    >
{
  constructor(
    @Inject(InjectionToken.MEMBER_REPOSITORY)
    private readonly memberRepository: MemberRepositoryPort,
    private readonly memberFactory: MemberFactory,
    @Inject(InjectionToken.BOARD_REPOSITORY)
    private readonly boardRepository: BoardRepositoryPort,
    @Inject(InjectionToken.HISTORY_REPOSITORY)
    private readonly historyRepository: HistoryRepositoryPort,
    private readonly historyFactory: HistoryFactory,
  ) {}

  async execute(
    command: AddBoardMemberCommand,
  ): Promise<
    Result<IdResponse, MemberAlreadyExistError | BoardCannotAccessedError>
  > {
    const isRequesterValid = await this.boardRepository.hasMember(
      command.boardId,
      command.requester.id,
    );
    if (isRequesterValid) {
      const hasMember = await this.boardRepository.hasMember(
        command.boardId,
        command.idUserToAdd,
      );
      if (hasMember) {
        return Err(new MemberAlreadyExistError());
      } else {
        const member = this.memberFactory.create(command.idUserToAdd);
        await this.memberRepository.save(member, command.boardId);
        const history = this.historyFactory.create({
          userId: command.requester.id,
          action: 'ADD',
          createOn: new Date(),
          boardId: command.boardId,
          message: `${command.requester.name} ADDED MEMBER`,
          content: { ...command },
        });
        await this.historyRepository.save(history);
        return Ok(new IdResponse(member.getProperties().id));
      }
    } else {
      return Err(new BoardCannotAccessedError());
    }
  }
}
