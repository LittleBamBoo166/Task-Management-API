import { User } from 'src/infrastructure/entity/user.orm-entity';

export class CreateTaskCommand {
  readonly name: string;
  readonly dueDate?: string;
  readonly priority?: number;
  readonly order?: number;
  readonly listId: string;
  readonly requester: User;

  constructor(
    requester: User,
    listId: string,
    name: string,
    dueDate?: string,
    priority?: number,
    order?: number,
  ) {
    this.listId = listId;
    this.dueDate = dueDate;
    this.name = name;
    this.priority = priority;
    this.order = order;
    this.requester = requester;
  }
}
