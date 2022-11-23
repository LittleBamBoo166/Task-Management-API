export class GetBoardsQuery {
  readonly ownerId: string;
  constructor(ownerId: string) {
    this.ownerId = ownerId;
  }
}
