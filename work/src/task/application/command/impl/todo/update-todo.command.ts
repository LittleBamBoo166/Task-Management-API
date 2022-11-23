export class UpdateTodoCommand {
  readonly id: string;
  readonly taskId: string;
  readonly requesterId: string;
  readonly name?: string;
  readonly parentTodoId?: string;
  readonly checked?: boolean;

  constructor(
    id: string,
    taskId: string,
    requesterId: string,
    name?: string,
    parentTodoId?: string,
    checked?: boolean,
  ) {
    this.id = id;
    this.taskId = taskId;
    this.requesterId = requesterId;
    this.name = name;
    this.parentTodoId = parentTodoId;
    this.checked = checked;
  }
}
