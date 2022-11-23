import { UpdateTaskProperties } from 'src/task/domain/model/task.model';

export class UpdateTaskCommand {
  readonly taskId: string;
  readonly requesterId: string;
  readonly updateProperties: UpdateTaskProperties;

  constructor(
    taskId: string,
    requesterId: string,
    updateProperties: UpdateTaskProperties,
  ) {
    this.taskId = taskId;
    this.requesterId = requesterId;
    this.updateProperties = updateProperties;
  }
}
