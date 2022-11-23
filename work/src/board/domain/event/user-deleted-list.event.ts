export class UserDeletedListEvent {
  readonly id: string;
  readonly requesterId: string;

  constructor(id: string, requesterId: string) {
    this.id = id;
    this.requesterId = requesterId;
  }
}
