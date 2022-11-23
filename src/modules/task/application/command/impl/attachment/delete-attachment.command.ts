import { User } from 'src/infrastructure/entity/user.orm-entity';

export class DeleteAttachmentCommand {
  readonly id: string;
  readonly taskId: string;
  readonly requester: User;

  constructor(id: string, taskId: string, requester: User) {
    this.id = id;
    this.taskId = taskId;
    this.requester = requester;
  }
}
