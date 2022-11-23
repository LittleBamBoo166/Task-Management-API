import { User } from 'src/infrastructure/entity/user.orm-entity';

export class CreateLabelCommand {
  readonly name: string;
  readonly color?: string;
  readonly boardId: string;
  readonly requester: User;

  constructor(requester: User, boardId: string, name: string, color?: string) {
    this.requester = requester;
    this.boardId = boardId;
    this.name = name;
    this.color = color;
  }
}
