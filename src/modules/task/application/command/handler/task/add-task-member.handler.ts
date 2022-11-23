import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result, Ok, Err } from 'oxide.ts';
import { IdResponse } from 'src/libs/dto/id.response.dto';
import {
  InvalidMemberError,
  TaskNotFoundError,
} from 'src/modules/task/domain/error/task.error';
import { Inject } from '@nestjs/common';
import { TaskRepositoryPort } from 'src/modules/task/domain/database/task.repository.port';
import { InjectionToken } from '../../../injection.token';
import { Checking } from 'src/libs/util/checking';
import { AddTaskMemberCommand } from '../../impl/task/add-task-member.command';
import { HistoryRepositoryPort } from 'src/libs/port/history.repository.port';
import { HistoryFactory } from 'src/libs/factory/history.factory';

@CommandHandler(AddTaskMemberCommand)
export class AddTaskMemberHandler
  implements
    ICommandHandler<
      AddTaskMemberCommand,
      Result<IdResponse, TaskNotFoundError | InvalidMemberError>
    >
{
  constructor(
    @Inject(InjectionToken.TASK_REPOSITORY)
    private readonly taskRepository: TaskRepositoryPort,
    @Inject(InjectionToken.HISTORY_REPOSITORY)
    private readonly historyRepository: HistoryRepositoryPort,
    private readonly historyFactory: HistoryFactory,
  ) {}

  async execute(
    command: AddTaskMemberCommand,
  ): Promise<Result<IdResponse, TaskNotFoundError | InvalidMemberError>> {
    const task = await this.taskRepository.getOneById(
      command.taskId,
      command.requester.id,
    );
    if (Checking.isEmpty(task)) {
      return Err(new TaskNotFoundError());
    } else {
      const isMemberAdded = task.addMember(command.memberId);
      if (isMemberAdded) {
        await this.taskRepository.save(task);
        const history = this.historyFactory.create({
          userId: command.requester.id,
          action: 'ADD',
          createOn: new Date(),
          taskId: command.taskId,
          message: `${command.requester.name} ADD MEMBER TO TASK`,
          content: { ...command },
        });
        await this.historyRepository.save(history);
        return Ok(new IdResponse(command.memberId));
      } else {
        return Err(new InvalidMemberError());
      }
    }
  }
}
