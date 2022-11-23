export class DeleteCommentCommand {
  readonly id: string;
  readonly requesterId: string;
  readonly taskId: string;

  constructor(id: string, requesterId: string, taskId: string) {
    this.id = id;
    this.requesterId = requesterId;
    this.taskId = taskId;
  }
}
