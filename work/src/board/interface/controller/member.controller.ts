import {
  Body,
  ConflictException,
  Controller,
  Delete,
  NotAcceptableException,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AddBoardMemberCommand } from '../../application/command/impl/member/add-board-member.command';
import { CreateMemberRequest } from '../dto/member/create-member.request';
import { match, Result } from 'oxide.ts';
import {
  MemberAlreadyExistError,
  MemberDoesNotExistError,
} from '../../domain/error/member.error';
import { BoardCannotAccessedError } from '../../domain/error/board.error';
import { IdResponse } from 'src/libs/id.response.dto';
import { RemoveBoardMemberCommand } from '../../application/command/impl/member/remove-board-member.command';
import { AuthGuard } from 'src/libs/auth.guard';
import RequestWithUser from 'src/libs/request-with-user';

@ApiTags('member')
@UseGuards(AuthGuard)
@Controller('boards/:id/members')
export class MemberController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiBody({ type: CreateMemberRequest })
  @Post()
  async addMemberToBoard(
    @Param('id') boardId: string,
    @Req() req: RequestWithUser,
    @Body() data: CreateMemberRequest,
  ) {
    const command = new AddBoardMemberCommand(boardId, req.user.id, data.id);
    const result: Result<
      IdResponse,
      MemberAlreadyExistError | BoardCannotAccessedError
    > = await this.commandBus.execute(command);
    return match(result, {
      Ok: (id) => id,
      Err: (err) => {
        if (err instanceof MemberAlreadyExistError)
          throw new ConflictException(err.message);
        if (err instanceof BoardCannotAccessedError)
          throw new NotAcceptableException(err.message);
        throw err;
      },
    });
  }

  @Delete(':memberid')
  async removeBoardMemebr(
    @Req() req: RequestWithUser,
    @Param('id') boardId: string,
    @Param('memberid') memberId: string,
  ) {
    const command = new RemoveBoardMemberCommand(
      boardId,
      req.user.id,
      memberId,
    );
    const result: Result<
      IdResponse,
      MemberDoesNotExistError | BoardCannotAccessedError
    > = await this.commandBus.execute(command);
    return match(result, {
      Ok: (id) => id,
      Err: (err) => {
        if (err instanceof MemberDoesNotExistError)
          throw new NotFoundException(err.message);
        if (err instanceof BoardCannotAccessedError)
          throw new NotAcceptableException(err.message);
        throw err;
      },
    });
  }
}
