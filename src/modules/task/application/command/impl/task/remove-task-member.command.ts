import { User } from 'src/infrastructure/entity/user.orm-entity';

export class RemoveTaskMemberCommand {
  readonly taskId: string;
  readonly requester: User;
  readonly memberId: string;

  constructor(taskId: string, requester: User, memberId: string) {
    this.taskId = taskId;
    this.requester = requester;
    this.memberId = memberId;
  }
}
