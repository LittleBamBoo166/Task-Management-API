export class UserDeletedBoardEvent {
  readonly boardId: string;
  readonly userId: string;

  constructor(boardId: string, userId: string) {
    this.boardId = boardId;
    this.userId = userId;
  }
}
