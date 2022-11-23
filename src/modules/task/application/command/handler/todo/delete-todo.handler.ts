import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result, Ok, Err } from 'oxide.ts';
import { IdResponse } from 'src/libs/dto/id.response.dto';
import { Checking } from 'src/libs/util/checking';
import { TaskRepositoryPort } from 'src/modules/task/domain/database/task.repository.port';
import { TaskNotFoundError } from 'src/modules/task/domain/error/task.error';
import { TodoRepositoryPort } from 'src/modules/task/domain/database/todo.repository.port';
import { TodoNotFoundError } from 'src/modules/task/domain/error/todo.error';
import { InjectionToken } from '../../../injection.token';
import { DeleteTodoCommand } from '../../impl/todo/delete-todo.command';
import { HistoryRepositoryPort } from 'src/libs/port/history.repository.port';
import { HistoryFactory } from 'src/libs/factory/history.factory';

@CommandHandler(DeleteTodoCommand)
export class DeleteTodoHandler
  implements
    ICommandHandler<
      DeleteTodoCommand,
      Result<IdResponse, TodoNotFoundError | TaskNotFoundError>
    >
{
  constructor(
    @Inject(InjectionToken.TODO_REPOSITORY)
    private readonly todoRepository: TodoRepositoryPort,
    @Inject(InjectionToken.TASK_REPOSITORY)
    private readonly taskRepository: TaskRepositoryPort,
    @Inject(InjectionToken.HISTORY_REPOSITORY)
    private readonly historyRepository: HistoryRepositoryPort,
    private readonly historyFactory: HistoryFactory,
  ) {}

  async execute(
    command: DeleteTodoCommand,
  ): Promise<Result<IdResponse, TaskNotFoundError | TodoNotFoundError>> {
    const task = await this.taskRepository.getOneById(
      command.taskId,
      command.requester.id,
    );
    if (Checking.isEmpty(task)) {
      return Err(new TaskNotFoundError());
    } else {
      const todo = await this.todoRepository.getOneById(
        command.id,
        command.taskId,
      );
      if (Checking.isEmpty(todo)) {
        return Err(new TodoNotFoundError());
      }
      await this.todoRepository.delete(todo.id);
      const history = this.historyFactory.create({
        userId: command.requester.id,
        action: 'DELETE',
        createOn: new Date(),
        taskId: command.taskId,
        message: `${command.requester.name} DELETED TODO`,
        content: { ...command },
      });
      await this.historyRepository.save(history);
      return Ok(new IdResponse(command.id));
    }
  }
}
