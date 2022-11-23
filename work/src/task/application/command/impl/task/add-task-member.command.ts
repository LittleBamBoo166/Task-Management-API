export class AddTaskMemberCommand {
  readonly taskId: string;
  readonly requesterId: string;
  readonly memberId: string;

  constructor(taskId: string, requesterId: string, memberId: string) {
    this.taskId = taskId;
    this.requesterId = requesterId;
    this.memberId = memberId;
  }
}
