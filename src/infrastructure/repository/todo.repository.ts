import { Inject } from '@nestjs/common';
import { IdTypes } from 'src/libs/type/id.type';
import { TodoRepositoryPort } from 'src/modules/task/domain/database/todo.repository.port';
import { TodoModel } from 'src/modules/task/domain/model/todo.model';
import { TodoFactory } from 'src/modules/task/domain/todo.factory';
import { DeleteResult, getRepository } from 'typeorm';
import { Task } from '../entity/task.orm-entity';
import { Todo } from '../entity/todo.orm-entity';

export class TodoRepositoryAdapter implements TodoRepositoryPort {
  constructor(@Inject(TodoFactory) private readonly todoFactory: TodoFactory) {}

  async deleteMany(by: IdTypes, data: string): Promise<boolean> {
    if (by === 'boardId') return this.deleteManyByBoardId(data);
    if (by === 'listId') return this.deleteManyByListId(data);
    if (by === 'taskId') return this.deleteManyByTaskId(data);
    return false;
  }

  private async deleteManyByBoardId(boardId: string): Promise<boolean> {
    const todoRepository = getRepository(Todo);
    const todos = await todoRepository
      .createQueryBuilder('todo')
      .leftJoinAndSelect('todo.task', 'task')
      .leftJoinAndSelect('task.list', 'list')
      .leftJoinAndSelect('list.board', 'board')
      .where('board.id = :bid', { bid: boardId })
      .getMany();
    const deleteResult = await todoRepository.remove(todos);
    if (!deleteResult) {
      return false;
    }
    return true;
  }

  private async deleteManyByListId(listId: string): Promise<boolean> {
    const todoRepository = getRepository(Todo);
    const todos = await todoRepository
      .createQueryBuilder('todo')
      .leftJoinAndSelect('todo.task', 'task')
      .leftJoinAndSelect('task.list', 'list')
      .where('list.id = :lid', { lid: listId })
      .getMany();
    const deleteResult = await todoRepository.remove(todos);
    if (!deleteResult) {
      return false;
    }
    return true;
  }

  private async deleteManyByTaskId(taskId: string): Promise<boolean> {
    const todoRepository = getRepository(Todo);
    const todos = await todoRepository
      .createQueryBuilder('todo')
      .leftJoinAndSelect('todo.task', 'task')
      .where('task.id = :tid', { tid: taskId })
      .getMany();
    const deleteResult = await todoRepository.remove(todos);
    if (!deleteResult) {
      return false;
    }
    return true;
  }

  async getOneById(id: string, taskId: string): Promise<TodoModel> {
    const todoRepository = getRepository(Todo);
    const todo = await todoRepository
      .createQueryBuilder('todo')
      .leftJoinAndSelect('todo.task', 'task')
      .where('task.id = :tid', { tid: taskId })
      .andWhere('todo.id = :id', { id: id })
      .getOne();
    return this.ormToModel(todo);
  }

  async save(todo: TodoModel | TodoModel[]): Promise<Todo | Todo[]> {
    const todoRepository = getRepository(Todo);
    const models = Array.isArray(todo) ? todo : [todo];
    const ormEntities = models.map((model) => this.modelToOrm(model));
    const result = await todoRepository.save(ormEntities);
    return result;
  }

  async delete(id: string): Promise<boolean> {
    const todoRepository = getRepository(Todo);
    const deleteResult: DeleteResult = await todoRepository
      .createQueryBuilder()
      .delete()
      .from(Todo)
      .where('id = :id', { id: id })
      .execute();
    if (!deleteResult || deleteResult.affected === 0) {
      return false;
    }
    return true;
  }

  private modelToOrm(model: TodoModel): Todo {
    const properties = model.getProperties();
    const task = new Task(properties.taskId);
    return {
      ...properties,
      task: task,
    };
  }

  private ormToModel(ormEntity: Todo): TodoModel {
    if (!ormEntity) {
      return null;
    }
    return this.todoFactory.reconstitute({
      ...ormEntity,
      taskId: ormEntity.task.id,
    });
  }
}
