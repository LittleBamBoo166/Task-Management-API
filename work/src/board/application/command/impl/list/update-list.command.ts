export class UpdateListCommand {
  readonly id: string;
  readonly name?: string;
  readonly color?: string;
  readonly order?: number;
  readonly boardId: string;
  readonly requesterId: string;

  constructor(
    requesterId: string,
    boardId: string,
    id: string,
    name?: string,
    color?: string,
    order?: number,
  ) {
    this.id = id;
    this.boardId = boardId;
    this.requesterId = requesterId;
    this.name = name;
    this.color = color;
    this.order = order;
  }
}
