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
import { UpdateTodoCommand } from '../../impl/todo/update-todo.command';
import { HistoryService } from 'src/history/history.service';
import { CreateHistoryObject } from 'src/history/history.type';
import { History } from 'src/history/entity/history.orm-entity';

@CommandHandler(UpdateTodoCommand)
export class UpdateTodoHandler
  implements
    ICommandHandler<
      UpdateTodoCommand,
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
    command: UpdateTodoCommand,
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
      } else {
        todo.edit({ ...command });
        await this.todoRepository.save(todo);
        const historyEntities: History[] = [];
        if (command.checked) {
          const todoCheckedHistoryObject: CreateHistoryObject = {
            userId: command.requesterId,
            taskId: task.id,
            action: 'UPDATE',
            message: command.checked
              ? 'checked the todo'
              : 'unchecked the todo',
            changedContent: {
              id: todo.id,
            },
          };
          const todoCheckedHistoryEntity = this.historyService.create(
            todoCheckedHistoryObject,
          );
          historyEntities.push(todoCheckedHistoryEntity);
        }
        if (command.name) {
          const nameChangedHistoryObject: CreateHistoryObject = {
            userId: command.requesterId,
            taskId: task.id,
            action: 'UPDATE',
            message: command.checked
              ? 'checked the todo'
              : 'unchecked the todo',
            changedContent: {
              id: todo.id,
            },
          };
          const nameChangedHistoryEntity = this.historyService.create(
            nameChangedHistoryObject,
          );
          historyEntities.push(nameChangedHistoryEntity);
        }
        await this.historyService.save(historyEntities);
        return Ok(new IdResponse(command.id));
      }
    }
  }
}
