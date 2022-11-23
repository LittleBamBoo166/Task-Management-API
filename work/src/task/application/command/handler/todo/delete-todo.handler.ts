import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result, Ok, Err } from 'oxide.ts';
import { IdResponse } from 'src/libs/id.response.dto';
import { Checking } from 'src/libs/checking';
import { TaskRepositoryPort } from 'src/task/domain/database/task.repository.port';
import { TaskNotFoundError } from 'src/task/domain/error/task.error';
import { TodoRepositoryPort } from 'src/task/domain/database/todo.repository.port';
import { TodoNotFoundError } from 'src/task/domain/error/todo.error';
import { InjectionToken } from '../../../injection.token';
import { DeleteTodoCommand } from '../../impl/todo/delete-todo.command';
import { HistoryService } from 'src/history/history.service';
import { CreateHistoryObject } from 'src/history/history.type';

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
    private readonly historyService: HistoryService,
  ) {}

  async execute(
    command: DeleteTodoCommand,
  ): Promise<Result<IdResponse, TaskNotFoundError | TodoNotFoundError>> {
    const task = await this.taskRepository.getOneById(
      command.taskId,
      command.requesterId,
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
      const historyObject: CreateHistoryObject = {
        userId: command.requesterId,
        taskId: task.id,
        action: 'DELETE',
        message: 'deleted a todo',
        changedContent: {
          id: todo.id,
          name: todo.getProperties().name,
        },
      };
      const historyEntity = this.historyService.create(historyObject);
      await this.historyService.save(historyEntity);
      return Ok(new IdResponse(command.id));
    }
  }
}
