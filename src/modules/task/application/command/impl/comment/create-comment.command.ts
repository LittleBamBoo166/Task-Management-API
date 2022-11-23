import { User } from 'src/infrastructure/entity/user.orm-entity';

export class CreateCommentCommand {
  readonly requester: User;
  readonly content: string;
  readonly taskId: string;

  constructor(requester: User, content: string, taskId: string) {
    this.requester = requester;
    this.content = content;
    this.taskId = taskId;
  }
}
