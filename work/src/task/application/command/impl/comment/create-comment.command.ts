export class CreateCommentCommand {
  readonly requesterId: string;
  readonly content: string;
  readonly taskId: string;

  constructor(requesterId: string, content: string, taskId: string) {
    this.requesterId = requesterId;
    this.content = content;
    this.taskId = taskId;
  }
}
