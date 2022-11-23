import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result, Ok, Err } from 'oxide.ts';
import { IdResponse } from 'src/libs/dto/id.response.dto';
import { HistoryFactory } from 'src/libs/factory/history.factory';
import { HistoryRepositoryPort } from 'src/libs/port/history.repository.port';
import { Checking } from 'src/libs/util/checking';
import { TaskRepositoryPort } from 'src/modules/task/domain/database/task.repository.port';
import { TodoRepositoryPort } from 'src/modules/task/domain/database/todo.repository.port';
import { TaskNotFoundError } from 'src/modules/task/domain/error/task.error';
import { TodoFactory } from 'src/modules/task/domain/todo.factory';
import { InjectionToken } from '../../../injection.token';
import { CreateTodoCommand } from '../../impl/todo/create-todo.command';

@CommandHandler(CreateTodoCommand)
export class CreateTodoHandler
  implements
    ICommandHandler<CreateTodoCommand, Result<IdResponse, TaskNotFoundError>>
{
  constructor(
    @Inject(InjectionToken.TODO_REPOSITORY)
    private readonly todoRepository: TodoRepositoryPort,
    private readonly todoFactory: TodoFactory,
    @Inject(InjectionToken.TASK_REPOSITORY)
    private readonly taskRepository: TaskRepositoryPort,
    @Inject(InjectionToken.HISTORY_REPOSITORY)
    private readonly historyRepository: HistoryRepositoryPort,
    private readonly historyFactory: HistoryFactory,
  ) {}

  async execute(
    command: CreateTodoCommand,
  ): Promise<Result<IdResponse, TaskNotFoundError>> {
    const task = await this.taskRepository.getOneById(
      command.taskId,
      command.requester.id,
    );
    if (Checking.isEmpty(task)) {
      return Err(new TaskNotFoundError());
    } else {
      const todo = this.todoFactory.create(
        command.taskId,
        command.name,
        command.parentTodoId,
      );
      await this.todoRepository.save(todo);
      const history = this.historyFactory.create({
        userId: command.requester.id,
        action: 'CREATE',
        createOn: new Date(),
        taskId: command.taskId,
        message: `${command.requester.name} CREATED TODO`,
        content: { ...command },
      });
      await this.historyRepository.save(history);
      return Ok(new IdResponse(todo.getProperties().id));
    }
  }
}
