export class UpdateDueDateCommand {
  readonly id: string;
  readonly requesterId: string;
  readonly dueDate: string;

  constructor(id: string, requesterId: string, dueDate: string) {
    this.id = id;
    this.requesterId = requesterId;
    this.dueDate = dueDate;
  }
}
