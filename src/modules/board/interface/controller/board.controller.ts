import {
  Body,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotAcceptableException,
  NotFoundException,
  Param,
  Patch,
  Post,
  PreconditionFailedException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { match, Result } from 'oxide.ts';
import { History } from 'src/infrastructure/entity/history.orm-entity';
import { IdResponse } from 'src/libs/dto/id.response.dto';
import { ArgumentNotProvideException } from 'src/libs/exception/argument-not-provide.exception';
import { JwtAuthGuard } from 'src/libs/auth/guard/jwt-auth.guard';
import RequestWithUser from 'src/libs/auth/request-with-user.interface';
import { CreateBoardCommand } from '../../application/command/impl/board/create-board.command';
import { DeleteBoardByIdCommand } from '../../application/command/impl/board/delete-board-by-id.command';
import { UpdateBoardCommand } from '../../application/command/impl/board/update-board.command';
import { GetBoardByIdQuery } from '../../application/query/impl/get-board-by-id.query';
import { GetBoardsQuery } from '../../application/query/impl/get-boards.query';
import { GetHistoryQuery } from '../../application/query/impl/get-history.query';
import {
  BoardAlreadyExistError,
  BoardCannotAccessedError,
  BoardNotFoundError,
} from '../../domain/error/board.error';
import { BoardResponse } from '../dto/board.response';
import { CreateBoardRequest } from '../dto/board/create-board.request';
import { UpdateBoardRequest } from '../dto/board/update-board.request';

@ApiTags('board')
@UseGuards(JwtAuthGuard)
@Controller('boards')
export class BoardController {
  constructor(readonly commandBus: CommandBus, readonly queryBus: QueryBus) {}

  @ApiBody({ type: CreateBoardRequest })
  @Post()
  async createBoard(
    @Req() req: RequestWithUser,
    @Body() data: CreateBoardRequest,
  ) {
    const command = new CreateBoardCommand(
      data.boardName,
      req.user,
      data.description,
    );
    const result: Result<IdResponse, BoardAlreadyExistError> =
      await this.commandBus.execute(command);
    return match(result, {
      Ok: (id) => id,
      Err: (err) => {
        if (err instanceof BoardAlreadyExistError)
          throw new ConflictException(err.message);
        throw err;
      },
    });
  }

  @ApiBody({ type: UpdateBoardRequest })
  @Patch(':id')
  async updateBoard(
    @Req() req: RequestWithUser,
    @Param('id') id: string,
    @Body() data: UpdateBoardRequest,
  ) {
    const command = new UpdateBoardCommand(
      req.user,
      id,
      data.name,
      data.description,
    );
    const result: Result<
      IdResponse,
      BoardNotFoundError | ArgumentNotProvideException
    > = await this.commandBus.execute(command);
    return match(result, {
      Ok: (id) => id,
      Err: (err) => {
        if (err instanceof BoardNotFoundError)
          throw new NotFoundException(err.message);
        if (err instanceof ArgumentNotProvideException)
          throw new PreconditionFailedException(err.message);
        throw err;
      },
    });
  }

  @Delete(':id')
  async deleteBoard(@Req() req: RequestWithUser, @Param('id') id: string) {
    const command = new DeleteBoardByIdCommand(id, req.user);
    const result: Result<
      IdResponse,
      BoardNotFoundError | BoardCannotAccessedError
    > = await this.commandBus.execute(command);
    return match(result, {
      Ok: (id) => id,
      Err: (err) => {
        if (err instanceof BoardNotFoundError)
          throw new NotFoundException(err.message);
        if (err instanceof BoardCannotAccessedError)
          throw new NotAcceptableException(err.message);
        throw err;
      },
    });
  }
  @Get()
  async getBoards(@Req() req: RequestWithUser) {
    const query = new GetBoardsQuery(req.user.id);
    const result: Result<BoardResponse[], BoardNotFoundError> =
      await this.queryBus.execute(query);
    return match(result, {
      Ok: (boards) => boards,
      Err: (err) => {
        if (err instanceof BoardNotFoundError)
          throw new NotFoundException(err.message);
        throw err;
      },
    });
  }

  @Get(':id')
  async getBoardById(@Req() req: RequestWithUser, @Param('id') id: string) {
    const query = new GetBoardByIdQuery(id, req.user.id);
    const result: Result<
      BoardResponse,
      BoardNotFoundError | BoardCannotAccessedError
    > = await this.queryBus.execute(query);
    return match(result, {
      Ok: (board) => board,
      Err: (err) => {
        if (err instanceof BoardNotFoundError)
          throw new NotFoundException(err.message);
        if (err instanceof BoardCannotAccessedError)
          throw new ForbiddenException(err.message);
        throw err;
      },
    });
  }

  @Get(':id/history')
  async getBoardHistory(@Req() req: RequestWithUser, @Param('id') id: string) {
    const query = new GetHistoryQuery(id, req.user);
    const result: Result<History[], BoardCannotAccessedError> =
      await this.queryBus.execute(query);
    return match(result, {
      Ok: (history) => history.map((his) => his.contentJson),
      Err: (err) => {
        if (err instanceof BoardCannotAccessedError)
          throw new ForbiddenException(err.message);
        throw err;
      },
    });
  }
}
