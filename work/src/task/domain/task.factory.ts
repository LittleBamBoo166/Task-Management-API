import { Inject } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { TaskModel, TaskProperties } from './model/task.model';

export class TaskFactory {
  constructor(
    @Inject(EventPublisher) private readonly eventPublisher: EventPublisher,
  ) {}

  create(
    name: string,
    listId: string,
    dueDate?: string,
    priority?: number,
    order?: number,
  ): TaskModel {
    return this.eventPublisher.mergeObjectContext(
      new TaskModel({
        id: uuidv4(),
        name: name,
        listId: listId,
        dueDate: dueDate,
        order: order,
        priority: priority,
      }),
    );
  }

  reconstitute(properties: TaskProperties): TaskModel {
    return this.eventPublisher.mergeObjectContext(new TaskModel(properties));
  }
}
