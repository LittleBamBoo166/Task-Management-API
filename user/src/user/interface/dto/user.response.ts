export class UserResponse {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: string;

  constructor(id: string, name: string, email: string, role: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
  }
}
