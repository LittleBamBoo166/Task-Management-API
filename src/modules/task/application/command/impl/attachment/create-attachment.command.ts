import { User } from 'src/infrastructure/entity/user.orm-entity';

export class CreateAttachmentCommand {
  readonly storateUri: string;
  readonly fileName: string;
  readonly requester: User;
  readonly taskId: string;

  constructor(
    storateUri: string,
    fileName: string,
    requester: User,
    taskId: string,
  ) {
    this.storateUri = storateUri;
    this.fileName = fileName;
    this.requester = requester;
    this.taskId = taskId;
  }
}
