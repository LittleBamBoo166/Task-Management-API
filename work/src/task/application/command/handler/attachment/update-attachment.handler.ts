import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result, Ok, Err } from 'oxide.ts';
import { IdResponse } from 'src/libs/id.response.dto';
import { Checking } from 'src/libs/checking';
import { AttachmentRepositoryPort } from 'src/task/domain/database/attachment.repository.port';
import { TaskRepositoryPort } from 'src/task/domain/database/task.repository.port';
import {
  AttachmentAlreadyExistError,
  AttachmentNotFoundError,
} from 'src/task/domain/error/attachment.error';
import { TaskCanNotAccessedError } from 'src/task/domain/error/task.error';
import { InjectionToken } from '../../../injection.token';
import { UpdateAttachmentCommand } from '../../impl/attachment/update-attachment.command';
import { HistoryService } from 'src/history/history.service';
import { CreateHistoryObject } from 'src/history/history.type';

@CommandHandler(UpdateAttachmentCommand)
export class UpdateAttachmentHandler
  implements
    ICommandHandler<
      UpdateAttachmentCommand,
      Result<
        IdResponse,
        | AttachmentNotFoundError
        | TaskCanNotAccessedError
        | AttachmentAlreadyExistError
      >
    >
{
  constructor(
    @Inject(InjectionToken.ATTACHMENT_REPOSITORY)
    private readonly attachmentRepository: AttachmentRepositoryPort,
    @Inject(InjectionToken.TASK_REPOSITORY)
    private readonly taskRepository: TaskRepositoryPort,
    private readonly historyService: HistoryService,
  ) {}

  async execute(
    command: UpdateAttachmentCommand,
  ): Promise<
    Result<
      IdResponse,
      | TaskCanNotAccessedError
      | AttachmentNotFoundError
      | AttachmentAlreadyExistError
    >
  > {
    const task = await this.taskRepository.getOneById(
      command.taskId,
      command.requesterId,
    );
    if (Checking.isEmpty(task)) {
      return Err(new TaskCanNotAccessedError());
    } else {
      const attachment = await this.attachmentRepository.getOneById(command.id);
      if (Checking.isEmpty(attachment)) {
        return Err(new AttachmentNotFoundError());
      }
      const isAttachmentNameValid = !(await this.attachmentRepository.exists(
        command.fileName,
        command.taskId,
      ));
      if (isAttachmentNameValid) {
        attachment.edit({ ...command });
        await this.attachmentRepository.save(attachment, command.taskId);
        const historyObject: CreateHistoryObject = {
          userId: command.requesterId,
          taskId: command.taskId,
          action: 'UPDATE',
          message: 'updated an attachment',
          changedContent: {
            id: attachment.getProperties().id,
            old: {
              fileName: attachment.getProperties().fileName,
              storageUri: attachment.getProperties().fileName,
            },
            new: {
              fileName: command.fileName,
              storageUri: command.storageUri,
            },
          },
        };
        const historyEntity = this.historyService.create(historyObject);
        await this.historyService.save(historyEntity);
        return Ok(new IdResponse(command.id));
      } else {
        return Err(new AttachmentAlreadyExistError());
      }
    }
  }
}
