export class GetUserByEmailQuery {
  readonly email: string;

  constructor(email: string) {
    this.email = email;
  }
}
