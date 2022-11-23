import { User } from 'src/infrastructure/entity/user.orm-entity';

export class UpdateTodoCommand {
  readonly id: string;
  readonly taskId: string;
  readonly requester: User;
  readonly name?: string;
  readonly parentTodoId?: string;
  readonly checked?: boolean;

  constructor(
    id: string,
    taskId: string,
    requester: User,
    name?: string,
    parentTodoId?: string,
    checked?: boolean,
  ) {
    this.id = id;
    this.taskId = taskId;
    this.requester = requester;
    this.name = name;
    this.parentTodoId = parentTodoId;
    this.checked = checked;
  }
}
