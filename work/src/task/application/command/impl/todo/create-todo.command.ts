export class CreateTodoCommand {
  readonly name: string;
  readonly parentTodoId?: string;
  readonly taskId: string;
  readonly requesterId: string;

  constructor(
    name: string,
    taskId: string,
    requesterId: string,
    parentTodoId?: string,
  ) {
    this.name = name;
    this.parentTodoId = parentTodoId;
    this.taskId = taskId;
    this.requesterId = requesterId;
  }
}
