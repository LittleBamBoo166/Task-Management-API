import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result, Ok, Err } from 'oxide.ts';
import { IdResponse } from 'src/libs/id.response.dto';
import { Checking } from 'src/libs/checking';
import { AttachmentFactory } from 'src/task/domain/attachment.factory';
import { AttachmentRepositoryPort } from 'src/task/domain/database/attachment.repository.port';
import { TaskRepositoryPort } from 'src/task/domain/database/task.repository.port';
import { AttachmentAlreadyExistError } from 'src/task/domain/error/attachment.error';
import { TaskNotFoundError } from 'src/task/domain/error/task.error';
import { InjectionToken } from '../../../injection.token';
import { CreateAttachmentCommand } from '../../impl/attachment/create-attachment.command';
import { HistoryService } from 'src/history/history.service';
import { CreateHistoryObject } from 'src/history/history.type';

@CommandHandler(CreateAttachmentCommand)
export class CreateAttachmentHandler
  implements
    ICommandHandler<
      CreateAttachmentCommand,
      Result<IdResponse, AttachmentAlreadyExistError | TaskNotFoundError>
    >
{
  constructor(
    @Inject(InjectionToken.ATTACHMENT_REPOSITORY)
    private readonly attachmentRepository: AttachmentRepositoryPort,
    private readonly attachmentFactory: AttachmentFactory,
    @Inject(InjectionToken.TASK_REPOSITORY)
    private readonly taskRepository: TaskRepositoryPort,
    private readonly historyService: HistoryService,
  ) {}

  async execute(
    command: CreateAttachmentCommand,
  ): Promise<
    Result<IdResponse, AttachmentAlreadyExistError | TaskNotFoundError>
  > {
    const task = await this.taskRepository.getOneById(
      command.taskId,
      command.requesterId,
    );
    if (Checking.isEmpty(task)) {
      return Err(new TaskNotFoundError());
    } else {
      const isAttachmentNameValid = !(await this.attachmentRepository.exists(
        command.fileName,
        command.taskId,
      ));
      if (isAttachmentNameValid) {
        const attachment = this.attachmentFactory.create(
          command.fileName,
          command.storateUri,
        );
        await this.attachmentRepository.save(attachment, command.taskId);
        const historyObject: CreateHistoryObject = {
          userId: command.requesterId,
          taskId: command.taskId,
          action: 'CREATE',
          message: 'created a new attachment',
          changedContent: {
            id: attachment.getProperties().id,
            fileName: command.fileName,
            storageUri: command.storateUri,
          },
        };
        const historyEntity = this.historyService.create(historyObject);
        await this.historyService.save(historyEntity);
        return Ok(new IdResponse(attachment.getProperties().id));
      } else {
        return Err(new AttachmentAlreadyExistError());
      }
    }
  }
}
