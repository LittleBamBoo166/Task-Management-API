export class UpdateCommentCommand {
  readonly id: string;
  readonly content: string;
  readonly requesterId: string;
  readonly taskId: string;

  constructor(
    id: string,
    content: string,
    requesterId: string,
    taskId: string,
  ) {
    this.id = id;
    this.content = content;
    this.requesterId = requesterId;
    this.taskId = taskId;
  }
}
