import { User } from 'src/infrastructure/entity/user.orm-entity';

export class RemoveBoardMemberCommand {
  readonly boardId: string;
  readonly requester: User;
  readonly idMemberToRemove: string;

  constructor(boardId: string, requester: User, idMemberToRemove: string) {
    this.boardId = boardId;
    this.requester = requester;
    this.idMemberToRemove = idMemberToRemove;
  }
}
