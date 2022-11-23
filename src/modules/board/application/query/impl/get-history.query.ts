import { User } from 'src/infrastructure/entity/user.orm-entity';

export class GetHistoryQuery {
  readonly boardId: string;
  readonly requester: User;

  constructor(boardId: string, requester: User) {
    this.boardId = boardId;
    this.requester = requester;
  }
}
