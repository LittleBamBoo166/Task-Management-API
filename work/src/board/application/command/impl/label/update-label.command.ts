export class UpdateLabelCommand {
  readonly id: string;
  readonly name?: string;
  readonly color?: string;
  readonly boardId: string;
  readonly requesterId: string;

  constructor(
    requesterId: string,
    boardId: string,
    id: string,
    name?: string,
    color?: string,
  ) {
    this.requesterId = requesterId;
    this.boardId = boardId;
    this.id = id;
    this.name = name;
    this.color = color;
  }
}
