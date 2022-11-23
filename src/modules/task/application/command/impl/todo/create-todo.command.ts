import { User } from 'src/infrastructure/entity/user.orm-entity';

export class CreateTodoCommand {
  readonly name: string;
  readonly parentTodoId?: string;
  readonly taskId: string;
  readonly requester: User;

  constructor(
    name: string,
    taskId: string,
    requester: User,
    parentTodoId?: string,
  ) {
    this.name = name;
    this.parentTodoId = parentTodoId;
    this.taskId = taskId;
    this.requester = requester;
  }
}
