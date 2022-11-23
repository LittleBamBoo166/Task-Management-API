export class ListDeletedWhenBoardDeletedEvent {
  readonly boardId: string;
  readonly userId: string;

  constructor(boardId: string, userId: string) {
    this.boardId = boardId;
    this.userId = userId;
  }
}
