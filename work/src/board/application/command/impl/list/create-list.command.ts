export class CreateListCommand {
  readonly name: string;
  readonly color?: string;
  readonly order?: number;
  readonly boardId: string;
  readonly requesterId: string;

  constructor(
    requesterId: string,
    boardId: string,
    name: string,
    color?: string,
    order?: number,
  ) {
    this.boardId = boardId;
    this.requesterId = requesterId;
    this.name = name;
    this.order = order;
    this.color = color;
  }
}
