export class CreateLabelCommand {
  readonly name: string;
  readonly color?: string;
  readonly boardId: string;
  readonly requesterId: string;

  constructor(
    requesterIdId: string,
    boardId: string,
    name: string,
    color?: string,
  ) {
    this.requesterId = requesterIdId;
    this.boardId = boardId;
    this.name = name;
    this.color = color;
  }
}
