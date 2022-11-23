export class CreateAttachmentCommand {
  readonly storateUri: string;
  readonly fileName: string;
  readonly requesterId: string;
  readonly taskId: string;

  constructor(
    storateUri: string,
    fileName: string,
    requesterId: string,
    taskId: string,
  ) {
    this.storateUri = storateUri;
    this.fileName = fileName;
    this.requesterId = requesterId;
    this.taskId = taskId;
  }
}
