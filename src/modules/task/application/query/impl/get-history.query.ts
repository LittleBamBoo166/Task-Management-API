import { User } from 'src/infrastructure/entity/user.orm-entity';

export class GetHistoryQuery {
  readonly taskId: string;
  readonly requester: User;

  constructor(taskId: string, requester: User) {
    this.taskId = taskId;
    this.requester = requester;
  }
}
