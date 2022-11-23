import { User } from 'src/infrastructure/entity/user.orm-entity';

export class AddBoardMemberCommand {
  readonly boardId: string;
  readonly requester: User;
  readonly idUserToAdd: string;

  constructor(boardId: string, requester: User, idUserToAdd: string) {
    this.boardId = boardId;
    this.requester = requester;
    this.idUserToAdd = idUserToAdd;
  }
}
