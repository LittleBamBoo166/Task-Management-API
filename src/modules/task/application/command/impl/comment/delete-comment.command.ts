import { User } from 'src/infrastructure/entity/user.orm-entity';

export class DeleteCommentCommand {
  readonly id: string;
  readonly requester: User;
  readonly taskId: string;

  constructor(id: string, requester: User, taskId: string) {
    this.id = id;
    this.requester = requester;
    this.taskId = taskId;
  }
}
