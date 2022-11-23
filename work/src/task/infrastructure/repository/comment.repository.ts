import { Inject } from '@nestjs/common';
import { IdTypes } from 'src/libs/id.type';
import { CommentFactory } from 'src/task/domain/comment.factory';
import { CommentRepositoryPort } from 'src/task/domain/database/comment.repository.port';
import { CommentModel } from 'src/task/domain/model/comment.model';
import { DeleteResult, getRepository } from 'typeorm';
import { Comment } from '../entity/comment.orm-entity';
import { Member } from 'src/board/infrastructure/entity/member.orm-entity';
import { Task } from '../entity/task.orm-entity';

export class CommentRepositoryAdapter implements CommentRepositoryPort {
  constructor(
    @Inject(CommentFactory)
    private readonly commentFactory: CommentFactory,
  ) {}

  private async deleteManyByBoardId(boardId: string): Promise<boolean> {
    const commentRepository = getRepository(Comment);
    const comment = await commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.task', 'task')
      .leftJoinAndSelect('task.list', 'list')
      .leftJoinAndSelect('list.board', 'board')
      .where('board.id = :id', { id: boardId })
      .getMany();
    const deleteResult = await commentRepository.remove(comment);
    if (!deleteResult) {
      return false;
    }
    return true;
  }

  private async deleteManyByListId(listId: string): Promise<boolean> {
    const commentRepository = getRepository(Comment);
    const comment = await commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.task', 'task')
      .leftJoinAndSelect('task.list', 'list')
      .where('list.id = :id', { id: listId })
      .getMany();
    const deleteResult = await commentRepository.remove(comment);
    if (!deleteResult) {
      return false;
    }
    return true;
  }

  private async deleteManyByTaskId(taskId: string): Promise<boolean> {
    const commentRepository = getRepository(Comment);
    const comment = await commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.task', 'task')
      .where('task.id = :id', { id: taskId })
      .getMany();
    const deleteResult = await commentRepository.remove(comment);
    if (!deleteResult) {
      return false;
    }
    return true;
  }

  async getOneById(id: string, requesterId: string): Promise<CommentModel> {
    const commentRepository = getRepository(Comment);
    const comment = await commentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.member', 'member')
      .where('member.userId = :id', { id: requesterId })
      .andWhere('comment.id = :cid', { cid: id })
      .getOne();
    return this.ormToModel(comment);
  }

  async save(
    comment: CommentModel | CommentModel[],
    taskId: string,
  ): Promise<Comment | Comment[]> {
    const commentRepository = getRepository(Comment);
    const models = Array.isArray(comment) ? comment : [comment];
    const ormEntities = models.map((model) => this.modelToOrm(model, taskId));
    const comments = await commentRepository.save(ormEntities);
    return comments;
  }

  async delete(id: string): Promise<boolean> {
    const commentRepository = getRepository(Comment);
    const deleteResult: DeleteResult = await commentRepository
      .createQueryBuilder()
      .delete()
      .from(Comment)
      .where('id = :id', { id: id })
      .execute();
    if (!deleteResult || deleteResult.affected === 0) {
      return false;
    }
    return true;
  }

  async deleteMany(by: IdTypes, data: string): Promise<boolean> {
    if (by === 'boardId') return this.deleteManyByBoardId(data);
    if (by === 'taskId') return this.deleteManyByTaskId(data);
    if (by === 'listId') return this.deleteManyByListId(data);
    return false;
  }

  private modelToOrm(model: CommentModel, taskId: string): Comment {
    const properties = model.getProperties();
    const taskOrm = new Task(taskId);
    const memberOrm = new Member(properties.memberId);
    return {
      ...properties,
      task: taskOrm,
      member: memberOrm,
    };
  }

  private ormToModel(ormEntity: Comment): CommentModel | null {
    if (!ormEntity) {
      return null;
    }
    return this.commentFactory.reconstitute({
      ...ormEntity,
      memberId: ormEntity.member.id,
    });
  }
}
