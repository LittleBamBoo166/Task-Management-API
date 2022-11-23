export class GetHistoryQuery {
  readonly boardId: string;
  readonly requesterId: string;

  constructor(boardId: string, requesterId: string) {
    this.boardId = boardId;
    this.requesterId = requesterId;
  }
}
