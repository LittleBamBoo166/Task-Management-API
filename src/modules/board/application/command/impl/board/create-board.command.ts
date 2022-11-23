import { User } from 'src/infrastructure/entity/user.orm-entity';

export class CreateBoardCommand {
  readonly boardName: string;
  readonly description?: string;
  readonly owner: User;

  constructor(boardName: string, owner: User, description?: string) {
    this.boardName = boardName;
    this.owner = owner;
    this.description = description;
  }
}
