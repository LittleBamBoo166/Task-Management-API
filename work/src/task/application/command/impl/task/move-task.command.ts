export class MoveTaskCommand {
  readonly id: string;
  readonly requesterId: string;
  readonly listId: string;
  readonly order: number;

  constructor(id: string, requesterId: string, listId: string, order: number) {
    this.id = id;
    this.requesterId = requesterId;
    this.listId = listId;
    this.order = order;
  }
}
