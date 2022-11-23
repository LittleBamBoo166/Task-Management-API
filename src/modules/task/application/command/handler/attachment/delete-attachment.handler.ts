import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result, Ok, Err } from 'oxide.ts';
import { IdResponse } from 'src/libs/dto/id.response.dto';
import { HistoryFactory } from 'src/libs/factory/history.factory';
import { HistoryRepositoryPort } from 'src/libs/port/history.repository.port';
import { Checking } from 'src/libs/util/checking';
import { AttachmentRepositoryPort } from 'src/modules/task/domain/database/attachment.repository.port';
import { TaskRepositoryPort } from 'src/modules/task/domain/database/task.repository.port';
import { AttachmentNotFoundError } from 'src/modules/task/domain/error/attachment.error';
import { TaskNotFoundError } from 'src/modules/task/domain/error/task.error';
import { InjectionToken } from '../../../injection.token';
import { DeleteAttachmentCommand } from '../../impl/attachment/delete-attachment.command';

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
    @Inject(InjectionToken.HISTORY_REPOSITORY)
    private readonly historyRepository: HistoryRepositoryPort,
    private readonly historyFactory: HistoryFactory,
  ) {}

  async execute(
    command: DeleteAttachmentCommand,
  ): Promise<Result<IdResponse, TaskNotFoundError | AttachmentNotFoundError>> {
    const task = await this.taskRepository.getOneById(
      command.taskId,
      command.requester.id,
    );
    if (Checking.isEmpty(task)) {
      return Err(new TaskNotFoundError());
    } else {
      const attachment = await this.attachmentRepository.getOneById(command.id);
      if (Checking.isEmpty(attachment)) {
        return Err(new AttachmentNotFoundError());
      }
      await this.attachmentRepository.delete(command.id);
      const history = this.historyFactory.create({
        userId: command.requester.id,
        action: 'DELETE',
        createOn: new Date(),
        taskId: command.taskId,
        message: `${command.requester.name} DELETED ATTACHMENT`,
        content: { ...command },
      });
      await this.historyRepository.save(history);
      return Ok(new IdResponse(command.id));
    }
  }
}
