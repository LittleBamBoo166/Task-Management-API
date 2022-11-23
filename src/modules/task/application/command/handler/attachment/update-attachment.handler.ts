import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result, Ok, Err } from 'oxide.ts';
import { IdResponse } from 'src/libs/dto/id.response.dto';
import { HistoryFactory } from 'src/libs/factory/history.factory';
import { HistoryRepositoryPort } from 'src/libs/port/history.repository.port';
import { Checking } from 'src/libs/util/checking';
import { AttachmentRepositoryPort } from 'src/modules/task/domain/database/attachment.repository.port';
import { TaskRepositoryPort } from 'src/modules/task/domain/database/task.repository.port';
import {
  AttachmentAlreadyExistError,
  AttachmentNotFoundError,
} from 'src/modules/task/domain/error/attachment.error';
import { TaskCanNotAccessedError } from 'src/modules/task/domain/error/task.error';
import { InjectionToken } from '../../../injection.token';
import { UpdateAttachmentCommand } from '../../impl/attachment/update-attachment.command';

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
    @Inject(InjectionToken.HISTORY_REPOSITORY)
    private readonly historyRepository: HistoryRepositoryPort,
    private readonly historyFactory: HistoryFactory,
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
      command.requester.id,
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
        const history = this.historyFactory.create({
          userId: command.requester.id,
          action: 'UPDATE',
          createOn: new Date(),
          taskId: command.taskId,
          message: `${command.requester.name} UPDATED ATTACHMENT`,
          content: { ...command },
        });
        await this.historyRepository.save(history);
        return Ok(new IdResponse(command.id));
      } else {
        return Err(new AttachmentAlreadyExistError());
      }
    }
  }
}
