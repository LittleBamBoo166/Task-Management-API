export class DeleteListCommand {
  readonly id: string;
  readonly boardId: string;
  readonly requesterId: string;

  constructor(id: string, boardId: string, requesterId: string) {
    this.id = id;
    this.boardId = boardId;
    this.requesterId = requesterId;
  }
}
