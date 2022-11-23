import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddBoardMemberCommand } from '../../impl/member/add-board-member.command';
import { Result, Err, Ok } from 'oxide.ts';
import { IdResponse } from 'src/libs/id.response.dto';
import { MemberAlreadyExistError } from 'src/board/domain/error/member.error';
import { Inject } from '@nestjs/common';
import { InjectionToken } from '../../../injection.token';
import { MemberRepositoryPort } from 'src/board/domain/database/member.repository.port';
import { MemberFactory } from 'src/board/domain/member.factory';
import { BoardRepositoryPort } from 'src/board/domain/database/board.repository.port';
import { BoardCannotAccessedError } from 'src/board/domain/error/board.error';
import { HistoryService } from 'src/history/history.service';
import { CreateHistoryObject } from 'src/history/history.type';

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
    private readonly historyService: HistoryService,
  ) {}

  async execute(
    command: AddBoardMemberCommand,
  ): Promise<
    Result<IdResponse, MemberAlreadyExistError | BoardCannotAccessedError>
  > {
    const isRequesterValid = await this.boardRepository.hasMember(
      command.boardId,
      command.requesterId,
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
        const historyObject: CreateHistoryObject = {
          userId: command.requesterId,
          boardId: command.boardId,
          action: 'ADD',
          message: 'added a member to the board',
          changedContent: {
            id: command.idUserToAdd,
          },
        };
        const historyEntity = this.historyService.create(historyObject);
        await this.historyService.save(historyEntity);
        return Ok(new IdResponse(member.getProperties().id));
      }
    } else {
      return Err(new BoardCannotAccessedError());
    }
  }
}
