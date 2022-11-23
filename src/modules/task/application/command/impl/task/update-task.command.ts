import { User } from 'src/infrastructure/entity/user.orm-entity';
import { UpdateTaskProperties } from 'src/modules/task/domain/model/task.model';

export class UpdateTaskCommand {
  readonly taskId: string;
  readonly requester: User;
  readonly updateProperties: UpdateTaskProperties;

  constructor(
    taskId: string,
    requester: User,
    updateProperties: UpdateTaskProperties,
  ) {
    this.taskId = taskId;
    this.requester = requester;
    this.updateProperties = updateProperties;
  }
}
