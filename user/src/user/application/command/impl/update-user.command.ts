export class UpdateUserCommand {
  readonly userId: string;
  readonly name?: string;
  readonly password?: string;
  readonly requestedId?: string;

  constructor(
    userId: string,
    name?: string,
    password?: string,
    requestedId?: string,
  ) {
    this.userId = userId;
    this.name = name;
    this.password = password;
    this.requestedId = requestedId;
  }
}
