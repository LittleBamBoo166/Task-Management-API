import { User } from 'src/infrastructure/entity/user.orm-entity';

export class AddTaskLabelCommand {
  readonly taskId: string;
  readonly requester: User;
  readonly labelId: string;

  constructor(taskId: string, requester: User, labelId: string) {
    this.taskId = taskId;
    this.requester = requester;
    this.labelId = labelId;
  }
}
