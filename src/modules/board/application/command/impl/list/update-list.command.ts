import { User } from 'src/infrastructure/entity/user.orm-entity';

export class UpdateListCommand {
  readonly id: string;
  readonly name?: string;
  readonly color?: string;
  readonly order?: number;
  readonly boardId: string;
  readonly requester: User;

  constructor(
    requester: User,
    boardId: string,
    id: string,
    name?: string,
    color?: string,
    order?: number,
  ) {
    this.id = id;
    this.boardId = boardId;
    this.requester = requester;
    this.name = name;
    this.color = color;
    this.order = order;
  }
}
