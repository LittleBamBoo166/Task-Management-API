export class AddTaskLabelCommand {
  readonly taskId: string;
  readonly requesterId: string;
  readonly labelId: string;

  constructor(taskId: string, requesterId: string, labelId: string) {
    this.taskId = taskId;
    this.requesterId = requesterId;
    this.labelId = labelId;
  }
}
