import { User } from 'src/infrastructure/entity/user.orm-entity';

export class CreateListCommand {
  readonly name: string;
  readonly color?: string;
  readonly order?: number;
  readonly boardId: string;
  readonly requester: User;

  constructor(
    requester: User,
    boardId: string,
    name: string,
    color?: string,
    order?: number,
  ) {
    this.boardId = boardId;
    this.requester = requester;
    this.name = name;
    this.order = order;
    this.color = color;
  }
}
