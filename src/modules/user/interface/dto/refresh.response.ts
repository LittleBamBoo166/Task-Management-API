export class RefreshResponse {
  id: string;
  token: string;

  constructor(id: string, token: string) {
    this.id = id;
    this.token = token;
  }
}
