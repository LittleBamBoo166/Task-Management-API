import { User } from 'src/infrastructure/entity/user.orm-entity';

export class UpdateDueDateCommand {
  readonly id: string;
  readonly requester: User;
  readonly dueDate: string;

  constructor(id: string, requester: User, dueDate: string) {
    this.id = id;
    this.requester = requester;
    this.dueDate = dueDate;
  }
}
