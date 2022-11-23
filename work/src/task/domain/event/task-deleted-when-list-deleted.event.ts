export class TaskDeletedWhenListDeletedEvent {
  readonly listId: string;
  readonly userId: string;

  constructor(listId: string, userId: string) {
    this.listId = listId;
    this.userId = userId;
  }
}
