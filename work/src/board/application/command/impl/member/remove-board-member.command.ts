export class RemoveBoardMemberCommand {
  readonly boardId: string;
  readonly requesterId: string;
  readonly idMemberToRemove: string;

  constructor(boardId: string, requesterId: string, idMemberToRemove: string) {
    this.boardId = boardId;
    this.requesterId = requesterId;
    this.idMemberToRemove = idMemberToRemove;
  }
}
