import {
  Body,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  NotFoundException,
  Param,
  Patch,
  Post,
  PreconditionFailedException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { IdResponse } from 'src/libs/dto/id.response.dto';
import { JwtAuthGuard } from 'src/libs/auth/guard/jwt-auth.guard';
import RequestWithUser from 'src/libs/auth/request-with-user.interface';
import { CreateListCommand } from '../../application/command/impl/list/create-list.command';
import { CreateListRequest } from '../dto/list/create-list.request';
import { match, Result } from 'oxide.ts';
import {
  ListAlreadyExistError,
  ListNotFoundError,
} from '../../domain/error/list.error';
import { UpdateListRequest } from '../dto/list/update-list.request';
import { UpdateListCommand } from '../../application/command/impl/list/update-list.command';
import { ArgumentNotProvideException } from 'src/libs/exception/argument-not-provide.exception';
import { BoardCannotAccessedError } from '../../domain/error/board.error';
import { DeleteListCommand } from '../../application/command/impl/list/delete-list.command';

@ApiTags('list')
@UseGuards(JwtAuthGuard)
@Controller('boards/:id/lists')
export class ListController {
  constructor(readonly commandBus: CommandBus) {}

  @ApiBody({ type: CreateListRequest })
  @Post()
  async createList(
    @Req() req: RequestWithUser,
    @Param('id') boardId: string,
    @Body() data: CreateListRequest,
  ) {
    const command = new CreateListCommand(
      req.user,
      boardId,
      data.name,
      data.color,
      data.order,
    );
    const result: Result<
      IdResponse,
      ListAlreadyExistError | BoardCannotAccessedError
    > = await this.commandBus.execute(command);
    return match(result, {
      Ok: (id) => id,
      Err: (err) => {
        if (err instanceof ListAlreadyExistError)
          throw new ConflictException(err.message);
        if (err instanceof BoardCannotAccessedError)
          throw new ForbiddenException(err.message);
        throw err;
      },
    });
  }

  @ApiBody({ type: UpdateListRequest })
  @Patch(':listid')
  async updateList(
    @Req() req: RequestWithUser,
    @Param('id') boardId: string,
    @Param('listid') listId: string,
    @Body() data: UpdateListRequest,
  ) {
    const command = new UpdateListCommand(
      req.user,
      boardId,
      listId,
      data.name,
      data.color,
      data.order,
    );
    const result: Result<
      IdResponse,
      ListNotFoundError | ArgumentNotProvideException | BoardCannotAccessedError
    > = await this.commandBus.execute(command);
    return match(result, {
      Ok: (id) => id,
      Err: (err) => {
        if (err instanceof ListNotFoundError)
          throw new NotFoundException(err.message);
        if (err instanceof ArgumentNotProvideException)
          throw new PreconditionFailedException(err.message);
        if (err instanceof BoardCannotAccessedError)
          throw new ForbiddenException(err.message);
        throw err;
      },
    });
  }

  @Delete(':listid')
  async deleteList(
    @Req() req: RequestWithUser,
    @Param('id') boardId: string,
    @Param('listid') listId: string,
  ) {
    const command = new DeleteListCommand(listId, boardId, req.user);
    const result: Result<
      IdResponse,
      ListNotFoundError | BoardCannotAccessedError
    > = await this.commandBus.execute(command);
    return match(result, {
      Ok: (id) => id,
      Err: (err) => {
        if (err instanceof ListNotFoundError)
          throw new NotFoundException(err.message);
        if (err instanceof BoardCannotAccessedError)
          throw new ForbiddenException(err.message);
        throw err;
      },
    });
  }
}
