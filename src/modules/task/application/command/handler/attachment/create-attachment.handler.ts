import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result, Ok, Err } from 'oxide.ts';
import { IdResponse } from 'src/libs/dto/id.response.dto';
import { HistoryFactory } from 'src/libs/factory/history.factory';
import { HistoryRepositoryPort } from 'src/libs/port/history.repository.port';
import { Checking } from 'src/libs/util/checking';
import { AttachmentFactory } from 'src/modules/task/domain/attachment.factory';
import { AttachmentRepositoryPort } from 'src/modules/task/domain/database/attachment.repository.port';
import { TaskRepositoryPort } from 'src/modules/task/domain/database/task.repository.port';
import { AttachmentAlreadyExistError } from 'src/modules/task/domain/error/attachment.error';
import { TaskNotFoundError } from 'src/modules/task/domain/error/task.error';
import { InjectionToken } from '../../../injection.token';
import { CreateAttachmentCommand } from '../../impl/attachment/create-attachment.command';

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
    @Inject(InjectionToken.HISTORY_REPOSITORY)
    private readonly historyRepository: HistoryRepositoryPort,
    private readonly historyFactory: HistoryFactory,
  ) {}

  async execute(
    command: CreateAttachmentCommand,
  ): Promise<
    Result<IdResponse, AttachmentAlreadyExistError | TaskNotFoundError>
  > {
    const task = await this.taskRepository.getOneById(
      command.taskId,
      command.requester.id,
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
        const history = this.historyFactory.create({
          userId: command.requester.id,
          action: 'CREATE',
          createOn: new Date(),
          taskId: command.taskId,
          message: `${command.requester.name} CREATED ATTACHMENT`,
          content: { ...command },
        });
        await this.historyRepository.save(history);
        return Ok(new IdResponse(attachment.getProperties().id));
      } else {
        return Err(new AttachmentAlreadyExistError());
      }
    }
  }
}
