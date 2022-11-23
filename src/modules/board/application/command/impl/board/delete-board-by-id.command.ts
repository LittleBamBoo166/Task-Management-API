import { User } from 'src/infrastructure/entity/user.orm-entity';

export class DeleteBoardByIdCommand {
  readonly id: string;
  readonly requester: User;

  constructor(id: string, requester: User) {
    this.id = id;
    this.requester = requester;
  }
}
