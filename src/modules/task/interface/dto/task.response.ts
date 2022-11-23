import { TaskProperties } from '../../domain/model/task.model';

export class TaskResponse {
  readonly id: string;
  readonly name: string;
  readonly listId: string;
  readonly dueDate?: string;
  readonly order?: number;
  readonly priority?: number;
  readonly members?: string[];
  readonly label?: string[];

  constructor(data: TaskProperties) {
    this.id = data.id;
    this.name = data.name;
    this.listId = data.listId;
    this.dueDate = data.dueDate;
    this.order = data.order;
    this.priority = data.priority;
    this.members = data.members ? data.members : null;
    this.label = data.labels ? data.labels : null;
  }
}
