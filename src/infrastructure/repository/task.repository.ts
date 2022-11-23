import { Inject } from '@nestjs/common';
import { Checking } from 'src/libs/util/checking';
import { AttachmentFactory } from 'src/modules/task/domain/attachment.factory';
import { CommentFactory } from 'src/modules/task/domain/comment.factory';
import { TaskRepositoryPort } from 'src/modules/task/domain/database/task.repository.port';
import { TaskModel } from 'src/modules/task/domain/model/task.model';
import { TaskFactory } from 'src/modules/task/domain/task.factory';
import { TodoFactory } from 'src/modules/task/domain/todo.factory';
import { DeleteResult, getRepository } from 'typeorm';
import { Label } from '../entity/label.orm-entity';
import { List } from '../entity/list.orm-entity';
import { Member } from '../entity/member.orm-entity';
import { Task } from '../entity/task.orm-entity';

export class TaskRepositoryAdapter implements TaskRepositoryPort {
  constructor(
    @Inject(TaskFactory) private readonly taskFactory: TaskFactory,
    @Inject(AttachmentFactory)
    private readonly attachmentFactory: AttachmentFactory,
    @Inject(CommentFactory) private readonly commentFactory: CommentFactory,
    @Inject(TodoFactory) private readonly todoFactory: TodoFactory,
  ) {}

  async validLabel(labelId: string, taskId: string): Promise<boolean> {
    const taskRepository = getRepository(Task);
    const findLabel = await taskRepository
      .createQueryBuilder('task')
      .leftJoin('task.list', 'list')
      .leftJoin('list.board', 'board')
      .leftJoin('board.labels', 'label')
      .where('task.id = :tid', { tid: taskId })
      .andWhere('label.id = :lid', { lid: labelId })
      .getOne();
    if (Checking.isEmpty(findLabel)) {
      return false;
    }
    return true;
  }

  async findByListId(listId: string): Promise<TaskModel[] | null> {
    const taskRepository = getRepository(Task);
    const tasks = await taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.list', 'list')
      .leftJoinAndSelect('list.board', 'board')
      .leftJoinAndSelect('task.members', 'member')
      .leftJoinAndSelect('task.labels', 'label')
      .where('list.id = :lid', { lid: listId })
      .getMany();
    return tasks.map((task) => this.ormToModel(task));
  }

  async getOneById(id: string, requesterId: string): Promise<TaskModel> {
    const taskRepository = getRepository(Task);
    const task = await taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.list', 'list')
      .leftJoinAndSelect('list.board', 'board')
      .leftJoinAndSelect('task.members', 'member')
      .leftJoinAndSelect('task.labels', 'label')
      .leftJoin('board.members', 'boardMember')
      .leftJoin('boardMember.user', 'user')
      .where('task.id = :tid', { tid: id })
      .andWhere('user.id = :uid', { uid: requesterId })
      .getOne();
    return this.ormToModel(task);
  }

  async getOneByIdWithDetail(
    id: string,
    requesterId: string,
  ): Promise<TaskModel> {
    const taskRepository = getRepository(Task);
    const task = await taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.list', 'list')
      .leftJoinAndSelect('list.board', 'board')
      .leftJoinAndSelect('task.members', 'member')
      .leftJoinAndSelect('task.comments', 'comment')
      .leftJoinAndSelect('task.labels', 'label')
      .leftJoinAndSelect('comment.member', 'memberComment')
      .leftJoinAndSelect('task.attachments', 'attachment')
      .leftJoinAndSelect('task.todos', 'todo')
      .leftJoin('board.members', 'boardMember')
      .leftJoin('boardMember.user', 'user')
      .where('task.id = :tid', { tid: id })
      .andWhere('user.id = :uid', { uid: requesterId })
      .getOne();
    return this.ormToModel(task);
  }

  async save(task: TaskModel | TaskModel[]): Promise<Task | Task[]> {
    const taskRepository = getRepository(Task);
    const models = Array.isArray(task) ? task : [task];
    const ormEntities = models.map((model) => this.modelToOrm(model));
    const result = await taskRepository.save(ormEntities);
    return result;
  }

  async delete(id: string): Promise<boolean> {
    const taskRepository = getRepository(Task);
    const deleteResult: DeleteResult = await taskRepository
      .createQueryBuilder()
      .delete()
      .from(Task)
      .where('id = :id', { id: id })
      .execute();
    if (!deleteResult || deleteResult.affected === 0) {
      return false;
    }
    return true;
  }

  async deleteMany(by: string, data: string): Promise<boolean> {
    const taskRepository = getRepository(Task);
    let deleteResult: DeleteResult | Task[];
    if (by === 'listId') {
      deleteResult = await taskRepository
        .createQueryBuilder()
        .delete()
        .from(Task)
        .where('_listId = :id', { id: data })
        .execute();
      if (!deleteResult || deleteResult.affected === 0) {
        return false;
      }
    } else if (by === 'boardId') {
      deleteResult = await taskRepository
        .createQueryBuilder('task')
        .leftJoin('task.list', 'list')
        .leftJoinAndSelect('list.board', 'board')
        .where('board.id = :id', { id: data })
        .getMany()
        .then((task) => {
          return taskRepository.remove(task);
        });
      if (!deleteResult) {
        return false;
      }
    } else {
      return false;
    }
    return true;
  }

  private ormToModel(ormEntity: Task): TaskModel | null {
    if (!ormEntity) {
      return null;
    }

    const attachmentModels = ormEntity.attachments
      ? ormEntity.attachments.map((attachment) =>
          this.attachmentFactory.reconstitute({ ...attachment }),
        )
      : undefined;
    const commentModels = ormEntity.comments
      ? ormEntity.comments.map((comment) =>
          this.commentFactory.reconstitute({
            ...comment,
            memberId: comment.member.id,
          }),
        )
      : undefined;
    const memberIds = ormEntity.members
      ? ormEntity.members.map((member) => member.id)
      : null;
    const labelIds = ormEntity.labels
      ? ormEntity.labels.map((label) => label.id)
      : null;
    const todoModels = ormEntity.todos
      ? ormEntity.todos.map((todo) =>
          this.todoFactory.reconstitute({
            ...todo,
            taskId: ormEntity.id,
          }),
        )
      : undefined;
    return this.taskFactory.reconstitute({
      ...ormEntity,
      listId: ormEntity.list.id,
      attachments: attachmentModels,
      boardId: ormEntity.list.board.id,
      members: memberIds,
      labels: labelIds,
      comments: commentModels,
      todos: todoModels,
    });
  }

  private modelToOrm(model: TaskModel): Task {
    const properties = model.getProperties();
    const memberOrmEntities =
      properties.members &&
      properties.members.map((memberId) => new Member(memberId));
    const labelOrmEntities =
      properties.labels &&
      properties.labels.map((labelId) => new Label(labelId));
    const listOrm = new List(properties.listId);
    return {
      id: properties.id,
      name: properties.name,
      dueDate: properties.dueDate,
      list: listOrm,
      order: properties.order,
      priority: properties.priority,
      members: memberOrmEntities,
      labels: labelOrmEntities,
      currentActive: properties.currentActive,
      _listId: listOrm.id,
    };
  }
}
