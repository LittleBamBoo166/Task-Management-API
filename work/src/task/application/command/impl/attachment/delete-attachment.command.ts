export class DeleteAttachmentCommand {
  readonly id: string;
  readonly taskId: string;
  readonly requesterId: string;

  constructor(id: string, taskId: string, requesterId: string) {
    this.id = id;
    this.taskId = taskId;
    this.requesterId = requesterId;
  }
}
