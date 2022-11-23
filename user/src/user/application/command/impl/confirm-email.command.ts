export class ConfirmEmailCommand {
  readonly token: string;

  constructor(token: string) {
    this.token = token;
  }
}
