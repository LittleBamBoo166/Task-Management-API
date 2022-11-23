export class UserCreatedBoardEvent {
  readonly id: string;
  readonly userId: string;

  constructor(id: string, userId: string) {
    this.id = id;
    this.userId = userId;
  }
}
