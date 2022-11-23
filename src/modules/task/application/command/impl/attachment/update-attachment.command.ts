import { User } from 'src/infrastructure/entity/user.orm-entity';

export class UpdateAttachmentCommand {
  readonly id: string;
  readonly storageUri: string;
  readonly fileName: string;
  readonly taskId: string;
  readonly requester: User;

  constructor(
    id: string,
    storageUri: string,
    fileName: string,
    taskId: string,
    requester: User,
  ) {
    this.id = id;
    this.storageUri = storageUri;
    this.fileName = fileName;
    this.taskId = taskId;
    this.requester = requester;
  }
}
