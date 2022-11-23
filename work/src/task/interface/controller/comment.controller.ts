import {
  Body,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Result, match } from 'oxide.ts';
import { AuthGuard } from 'src/libs/auth.guard';
import { IdResponse } from 'src/libs/id.response.dto';
import RequestWithUser from 'src/libs/request-with-user';
import { CreateCommentCommand } from '../../application/command/impl/comment/create-comment.command';
import { DeleteCommentCommand } from '../../application/command/impl/comment/delete-comment.command';
import { UpdateCommentCommand } from '../../application/command/impl/comment/update-comment.command';
import { CommentNotFoundError } from '../../domain/error/comment.error';
import { TaskNotFoundError } from '../../domain/error/task.error';
import { CreateCommentRequest } from '../dto/comment/create-comment.request';
import { UpdateCommentRequest } from '../dto/comment/update-comment.request';

@ApiTags('comment')
@UseGuards(AuthGuard)
@Controller('tasks/:id/comments')
export class CommentController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiBody({ type: CreateCommentRequest })
  @Post()
  async createComment(
    @Req() req: RequestWithUser,
    @Param('id') taskId: string,
    @Body() data: CreateCommentRequest,
  ) {
    const command = new CreateCommentCommand(req.user.id, data.content, taskId);
    const result: Result<IdResponse, TaskNotFoundError> =
      await this.commandBus.execute(command);
    return match(result, {
      Ok: (id) => id,
      Err: (err) => {
        if (err instanceof TaskNotFoundError)
          throw new ForbiddenException(err.message);
        throw err;
      },
    });
  }

  @ApiBody({ type: UpdateCommentRequest })
  @Put(':commentId')
  async updateAttachment(
    @Req() req: RequestWithUser,
    @Param('id') taskId: string,
    @Param('commentId') commentId: string,
    @Body() data: UpdateCommentRequest,
  ) {
    const command = new UpdateCommentCommand(
      commentId,
      data.content,
      req.user.id,
      taskId,
    );
    const result: Result<IdResponse, CommentNotFoundError | TaskNotFoundError> =
      await this.commandBus.execute(command);
    return match(result, {
      Ok: (id) => id,
      Err: (err) => {
        if (err instanceof CommentNotFoundError)
          throw new ConflictException(err.message);
        if (err instanceof TaskNotFoundError)
          throw new ForbiddenException(err.message);
        throw err;
      },
    });
  }

  @Delete(':commentId')
  async DeleteAttachmentCommand(
    @Req() req: RequestWithUser,
    @Param('id') taskId: string,
    @Param('commentId') commentId: string,
  ) {
    const command = new DeleteCommentCommand(commentId, req.user.id, taskId);
    const result: Result<IdResponse, CommentNotFoundError | TaskNotFoundError> =
      await this.commandBus.execute(command);
    return match(result, {
      Ok: (id) => id,
      Err: (err) => {
        if (err instanceof CommentNotFoundError)
          throw new NotFoundException(err.message);
        if (err instanceof TaskNotFoundError)
          throw new ForbiddenException(err.message);
        throw err;
      },
    });
  }
}
