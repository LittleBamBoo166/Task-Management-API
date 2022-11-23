export class AddBoardMemberCommand {
  readonly boardId: string;
  readonly requesterId: string;
  readonly idUserToAdd: string;

  constructor(boardId: string, requesterId: string, idUserToAdd: string) {
    this.boardId = boardId;
    this.requesterId = requesterId;
    this.idUserToAdd = idUserToAdd;
  }
}
