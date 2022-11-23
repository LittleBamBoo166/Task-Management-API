export class SetAdminRoleCommand {
  readonly requesterId: string;

  constructor(requesterId: string) {
    this.requesterId = requesterId;
  }
}
