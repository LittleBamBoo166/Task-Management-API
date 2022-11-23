import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Result, Ok, Err } from 'oxide.ts';
import { IdResponse } from 'src/libs/id.response.dto';
import { Checking } from 'src/libs/checking';
import { TaskRepositoryPort } from 'src/task/domain/database/task.repository.port';
import { TodoRepositoryPort } from 'src/task/domain/database/todo.repository.port';
import { TaskNotFoundError } from 'src/task/domain/error/task.error';
import { TodoFactory } from 'src/task/domain/todo.factory';
import { InjectionToken } from '../../../injection.token';
import { CreateTodoCommand } from '../../impl/todo/create-todo.command';
import { HistoryService } from 'src/history/history.service';
import { CreateHistoryObject } from 'src/history/history.type';

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
    private readonly historyService: HistoryService,
  ) {}

  async execute(
    command: CreateTodoCommand,
  ): Promise<Result<IdResponse, TaskNotFoundError>> {
    const task = await this.taskRepository.getOneById(
      command.taskId,
      command.requesterId,
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
      const historyObject: CreateHistoryObject = {
        userId: command.requesterId,
        taskId: task.id,
        action: 'CREATE',
        message: command.parentTodoId
          ? 'created a todo'
          : 'created a list todo',
        changedContent: {
          id: todo.id,
          name: command.name,
        },
      };
      const historyEntity = this.historyService.create(historyObject);
      await this.historyService.save(historyEntity);
      return Ok(new IdResponse(todo.getProperties().id));
    }
  }
}
