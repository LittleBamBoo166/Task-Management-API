import { User } from 'src/infrastructure/entity/user.orm-entity';

export class MoveTaskCommand {
  readonly id: string;
  readonly requester: User;
  readonly listId: string;
  readonly order: number;

  constructor(id: string, requester: User, listId: string, order: number) {
    this.id = id;
    this.requester = requester;
    this.listId = listId;
    this.order = order;
  }
}
