import { TodoModel, TodoProperties } from './model/todo.model';
import { v4 as uuidv4 } from 'uuid';
import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

export class TodoFactory {
  constructor(
    @Inject(EventPublisher) private readonly eventPublisher: EventPublisher,
  ) {}

  create(taskId: string, name: string, parentTodoId?: string): TodoModel {
    return new TodoModel({
      id: uuidv4(),
      name: name,
      taskId: taskId,
      parentTodoId: parentTodoId,
      checked: false,
    });
  }

  reconstitute(properties: TodoProperties): TodoModel {
    return this.eventPublisher.mergeObjectContext(new TodoModel(properties));
  }
}
