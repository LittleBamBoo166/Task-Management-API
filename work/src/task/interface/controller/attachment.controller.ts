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
import { CreateAttachmentCommand } from '../../application/command/impl/attachment/create-attachment.command';
import { DeleteAttachmentCommand } from '../../application/command/impl/attachment/delete-attachment.command';
import { UpdateAttachmentCommand } from '../../application/command/impl/attachment/update-attachment.command';
import {
  AttachmentAlreadyExistError,
  AttachmentNotFoundError,
} from '../../domain/error/attachment.error';
import { TaskNotFoundError } from '../../domain/error/task.error';
import { CreateAttachmentRequest } from '../dto/attachment/create-attachment.request';
import { UpdateAttachmentRequest } from '../dto/attachment/update-attachment.request';

@ApiTags('attachment')
@UseGuards(AuthGuard)
@Controller('tasks/:id/attachments')
export class AttachmentController {
  constructor(private readonly commandBus: CommandBus) {}

  @ApiBody({ type: CreateAttachmentRequest })
  @Post()
  async createAttachment(
    @Req() req: RequestWithUser,
    @Param('id') taskId: string,
    @Body() data: CreateAttachmentRequest,
  ) {
    const command = new CreateAttachmentCommand(
      data.storageUri,
      data.fileName,
      req.user.id,
      taskId,
    );
    const result: Result<
      IdResponse,
      AttachmentAlreadyExistError | TaskNotFoundError
    > = await this.commandBus.execute(command);
    return match(result, {
      Ok: (id) => id,
      Err: (err) => {
        if (err instanceof AttachmentAlreadyExistError)
          throw new ConflictException(err.message);
        if (err instanceof TaskNotFoundError)
          throw new ForbiddenException(err.message);
        throw err;
      },
    });
  }

  @ApiBody({ type: UpdateAttachmentRequest })
  @Put(':attachmentId')
  async updateAttachment(
    @Req() req: RequestWithUser,
    @Param('id') taskId: string,
    @Param('attachmentId') attachmentId,
    @Body() data: UpdateAttachmentRequest,
  ) {
    const command = new UpdateAttachmentCommand(
      attachmentId,
      data.storageUri,
      data.fileName,
      taskId,
      req.user.id,
    );
    const result: Result<
      IdResponse,
      AttachmentNotFoundError | TaskNotFoundError | AttachmentAlreadyExistError
    > = await this.commandBus.execute(command);
    return match(result, {
      Ok: (id) => id,
      Err: (err) => {
        if (
          err instanceof AttachmentNotFoundError ||
          err instanceof AttachmentAlreadyExistError
        )
          throw new ConflictException(err.message);
        if (err instanceof TaskNotFoundError)
          throw new ForbiddenException(err.message);
        throw err;
      },
    });
  }

  @Delete(':attachmentId')
  async DeleteAttachmentCommand(
    @Req() req: RequestWithUser,
    @Param('id') taskId: string,
    @Param('attachmentId') attachmentId: string,
  ) {
    const command = new DeleteAttachmentCommand(
      attachmentId,
      taskId,
      req.user.id,
    );
    const result: Result<
      IdResponse,
      AttachmentNotFoundError | TaskNotFoundError
    > = await this.commandBus.execute(command);
    return match(result, {
      Ok: (id) => id,
      Err: (err) => {
        if (err instanceof AttachmentNotFoundError)
          throw new NotFoundException(err.message);
        if (err instanceof TaskNotFoundError)
          throw new ForbiddenException(err.message);
        throw err;
      },
    });
  }
}
