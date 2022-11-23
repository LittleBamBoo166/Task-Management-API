export class GetTaskByListIdQuery {
  readonly listId: string;
  readonly requesterId: string;

  constructor(listId: string, requesterId: string) {
    this.listId = listId;
    this.requesterId = requesterId;
  }
}
