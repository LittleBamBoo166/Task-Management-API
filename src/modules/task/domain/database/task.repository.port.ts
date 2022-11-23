import { Task } from 'src/infrastructure/entity/task.orm-entity';
import { TaskModel } from '../model/task.model';

export interface TaskRepositoryPort {
  validLabel(labelId: string, taskId: string): Promise<boolean>;
  findByListId(boardId: string): Promise<TaskModel[]>;
  getOneById(id: string, requesterId: string): Promise<TaskModel>;
  getOneByIdWithDetail(id: string, requesterId: string): Promise<TaskModel>;
  save(task: TaskModel | TaskModel[]): Promise<Task | Task[]>;
  delete(id: string): Promise<boolean>;
  deleteMany(by: string, data: string): Promise<boolean>;
}
