import { User } from 'src/infrastructure/entity/user.orm-entity';

export class UpdateBoardCommand {
  readonly id: string;
  readonly name?: string;
  readonly description?: string;
  readonly requester: User;

  constructor(
    requester: User,
    id: string,
    name?: string,
    description?: string,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.requester = requester;
  }
}
