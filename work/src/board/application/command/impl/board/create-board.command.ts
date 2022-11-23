export class CreateBoardCommand {
  readonly boardName: string;
  readonly ownerId: string;
  readonly description?: string;

  constructor(boardName: string, ownerId: string, description?: string) {
    this.boardName = boardName;
    this.ownerId = ownerId;
    this.description = description;
  }
}
