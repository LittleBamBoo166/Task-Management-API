import { User } from 'src/infrastructure/entity/user.orm-entity';

export class UpdateLabelCommand {
  readonly id: string;
  readonly name?: string;
  readonly color?: string;
  readonly boardId: string;
  readonly requester: User;

  constructor(
    requester: User,
    boardId: string,
    id: string,
    name?: string,
    color?: string,
  ) {
    this.requester = requester;
    this.boardId = boardId;
    this.id = id;
    this.name = name;
    this.color = color;
  }
}
