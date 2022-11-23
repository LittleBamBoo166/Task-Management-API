export class LoginResponse {
  readonly id: string;
  readonly token: string;
  readonly refreshToken: string;

  constructor(id: string, token: string, refreshToken: string) {
    this.id = id;
    this.token = token;
    this.refreshToken = refreshToken;
  }
}
