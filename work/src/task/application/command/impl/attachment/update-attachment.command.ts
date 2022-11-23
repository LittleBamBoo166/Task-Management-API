export class UpdateAttachmentCommand {
  readonly id: string;
  readonly storageUri: string;
  readonly fileName: string;
  readonly taskId: string;
  readonly requesterId: string;

  constructor(
    id: string,
    storageUri: string,
    fileName: string,
    taskId: string,
    requesterId: string,
  ) {
    this.id = id;
    this.storageUri = storageUri;
    this.fileName = fileName;
    this.taskId = taskId;
    this.requesterId = requesterId;
  }
}
