export class UpdateBoardCommand {
  readonly id: string;
  readonly name?: string;
  readonly description?: string;
  readonly requesterId: string;

  constructor(
    requesterId: string,
    id: string,
    name?: string,
    description?: string,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.requesterId = requesterId;
  }
}
