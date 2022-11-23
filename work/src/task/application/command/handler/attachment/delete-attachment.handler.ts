import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result, Ok, Err } from 'oxide.ts';
import { IdResponse } from 'src/libs/id.response.dto';
import { Checking } from 'src/libs/checking';
import { AttachmentRepositoryPort } from 'src/task/domain/database/attachment.repository.port';
import { TaskRepositoryPort } from 'src/task/domain/database/task.repository.port';
import { AttachmentNotFoundError } from 'src/task/domain/error/attachment.error';
import { TaskNotFoundError } from 'src/task/domain/error/task.error';
import { InjectionToken } from '../../../injection.token';
import { DeleteAttachmentCommand } from '../../impl/attachment/delete-attachment.command';
import { HistoryService } from 'src/history/history.service';
import { CreateHistoryObject } from 'src/history/history.type';

@CommandHandler(DeleteAttachmentCommand)
export class DeleteAttachmentHandler
  implements
    ICommandHandler<
      DeleteAttachmentCommand,
      Result<IdResponse, AttachmentNotFoundError | TaskNotFoundError>
    >
{
  constructor(
    @Inject(InjectionToken.TASK_REPOSITORY)
    private readonly taskRepository: TaskRepositoryPort,
    @Inject(InjectionToken.ATTACHMENT_REPOSITORY)
    private readonly attachmentRepository: AttachmentRepositoryPort,
    private readonly historyService: HistoryService,
  ) {}

  async execute(
    command: DeleteAttachmentCommand,
  ): Promise<Result<IdResponse, TaskNotFoundError | AttachmentNotFoundError>> {
    const task = await this.taskRepository.getOneById(
      command.taskId,
      command.requesterId,
    );
    if (Checking.isEmpty(task)) {
      return Err(new TaskNotFoundError());
    } else {
      const attachment = await this.attachmentRepository.getOneById(command.id);
      if (Checking.isEmpty(attachment)) {
        return Err(new AttachmentNotFoundError());
      }
      await this.attachmentRepository.delete(command.id);
      const historyObject: CreateHistoryObject = {
        userId: command.requesterId,
        taskId: command.taskId,
        action: 'DELETE',
        message: 'deleted an attachment',
        changedContent: {
          id: attachment.getProperties().id,
          fileName: attachment.getProperties().fileName,
          storageUri: attachment.getProperties().storageUri,
        },
      };
      const historyEntity = this.historyService.create(historyObject);
      await this.historyService.save(historyEntity);
      return Ok(new IdResponse(command.id));
    }
  }
}
