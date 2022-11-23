export class GetHistoryQuery {
  readonly taskId: string;
  readonly requesterId: string;

  constructor(taskId: string, requesterId: string) {
    this.taskId = taskId;
    this.requesterId = requesterId;
  }
}
