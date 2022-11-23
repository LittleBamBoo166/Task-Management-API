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
import { match, Result } from 'oxide.ts';
import { IdResponse } from 'src/libs/dto/id.response.dto';
import { ArgumentNotProvideException } from 'src/libs/exception/argument-not-provide.exception';
import { JwtAuthGuard } from 'src/libs/auth/guard/jwt-auth.guard';
import RequestWithUser from 'src/libs/auth/request-with-user.interface';
import { CreateLabelCommand } from '../../application/command/impl/label/create-label.command';
import { DeleteLabelCommand } from '../../application/command/impl/label/delete-label.command';
import { UpdateLabelCommand } from '../../application/command/impl/label/update-label.command';
import { BoardCannotAccessedError } from '../../domain/error/board.error';
import {
  LabelAlreadyExistError,
  LabelNotFoundError,
} from '../../domain/error/label.error';
import { CreateLabelRequest } from '../dto/label/create-label.request';
import { UpdateLabelRequest } from '../dto/label/update-label.request';

@ApiTags('label')
@UseGuards(JwtAuthGuard)
@Controller('boards/:id/labels')
export class LabelController {
  constructor(readonly commandBus: CommandBus) {}

  @ApiBody({ type: CreateLabelRequest })
  @Post()
  async createLabel(
    @Req() req: RequestWithUser,
    @Param('id') boardId: string,
    @Body() data: CreateLabelRequest,
  ) {
    const command = new CreateLabelCommand(
      req.user,
      boardId,
      data.name,
      data.color,
    );
    const result: Result<
      IdResponse,
      LabelAlreadyExistError | BoardCannotAccessedError
    > = await this.commandBus.execute(command);
    return match(result, {
      Ok: (id) => id,
      Err: (err) => {
        if (err instanceof LabelAlreadyExistError)
          throw new ConflictException(err.message);
        if (err instanceof BoardCannotAccessedError)
          throw new ForbiddenException(err.message);
        throw err;
      },
    });
  }

  @ApiBody({ type: UpdateLabelRequest })
  @Patch(':labelid')
  async updateLabel(
    @Req() req: RequestWithUser,
    @Param('id') boardId: string,
    @Param('labelid') labelId: string,
    @Body() data: UpdateLabelRequest,
  ) {
    const command = new UpdateLabelCommand(
      req.user,
      boardId,
      labelId,
      data.name,
      data.color,
    );
    const result: Result<
      IdResponse,
      | LabelNotFoundError
      | ArgumentNotProvideException
      | BoardCannotAccessedError
      | LabelAlreadyExistError
    > = await this.commandBus.execute(command);
    return match(result, {
      Ok: (id) => id,
      Err: (err) => {
        if (err instanceof LabelNotFoundError)
          throw new NotFoundException(err.message);
        if (
          err instanceof ArgumentNotProvideException ||
          err instanceof LabelAlreadyExistError
        )
          throw new PreconditionFailedException(err.message);
        if (err instanceof BoardCannotAccessedError)
          throw new ForbiddenException(err.message);
        throw err;
      },
    });
  }

  @Delete(':labelid')
  async deleteLabel(
    @Req() req: RequestWithUser,
    @Param('id') boardId: string,
    @Param('labelid') labelId: string,
  ) {
    const command = new DeleteLabelCommand(labelId, boardId, req.user);
    const result: Result<
      IdResponse,
      LabelNotFoundError | BoardCannotAccessedError
    > = await this.commandBus.execute(command);
    return match(result, {
      Ok: (id) => id,
      Err: (err) => {
        if (err instanceof LabelNotFoundError)
          throw new NotFoundException(err.message);
        if (err instanceof BoardCannotAccessedError)
          throw new ForbiddenException(err.message);
        throw err;
      },
    });
  }
}
