import { User } from 'src/infrastructure/entity/user.orm-entity';

export class DeleteListCommand {
  readonly id: string;
  readonly boardId: string;
  readonly requester: User;

  constructor(id: string, boardId: string, requester: User) {
    this.id = id;
    this.boardId = boardId;
    this.requester = requester;
  }
}
