import { User } from 'src/infrastructure/entity/user.orm-entity';

export class UpdateCommentCommand {
  readonly id: string;
  readonly content: string;
  readonly requester: User;
  readonly taskId: string;

  constructor(id: string, content: string, requester: User, taskId: string) {
    this.id = id;
    this.content = content;
    this.requester = requester;
    this.taskId = taskId;
  }
}
