import { Todo } from 'src/infrastructure/entity/todo.orm-entity';
import { IdTypes } from 'src/libs/type/id.type';
import { TodoModel } from '../model/todo.model';

export interface TodoRepositoryPort {
  getOneById(id: string, taskId: string): Promise<TodoModel>;
  save(todo: TodoModel | TodoModel[]): Promise<Todo | Todo[]>;
  delete(id: string): Promise<boolean>;
  deleteMany(by: IdTypes, data: string): Promise<boolean>;
}
