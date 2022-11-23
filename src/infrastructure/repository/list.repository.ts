import { Inject } from '@nestjs/common';
import { IdTypes } from 'src/libs/type/id.type';
import { Checking } from 'src/libs/util/checking';
import { ListRepositoryPort } from 'src/modules/board/domain/database/list.repository.port';
import { ListFactory } from 'src/modules/board/domain/list.factory';
import { ListModel } from 'src/modules/board/domain/model/list.model';
import { DeleteResult, getRepository } from 'typeorm';
import { Board } from '../entity/board.orm-entity';
import { List } from '../entity/list.orm-entity';

export class ListRepositoryAdapter implements ListRepositoryPort {
  constructor(@Inject(ListFactory) private readonly listFactory: ListFactory) {}

  async inTheSameBoard(id1: string, id2: string): Promise<boolean> {
    const listRepository = getRepository(List);
    const list1 = await listRepository
      .createQueryBuilder('list')
      .leftJoinAndSelect('list.board', 'board')
      .where('list.id = :id', { id: id1 })
      .getOne();
    const list2 = await listRepository
      .createQueryBuilder('list')
      .leftJoinAndSelect('list.board', 'board')
      .where('list.id = :id', { id: id2 })
      .getOne();
    if (list1.board.id === list2.board.id) {
      return true;
    }
    return false;
  }

  async deleteMany(by: IdTypes, data: string): Promise<boolean> {
    const listRepository = getRepository(List);
    if (by === 'boardId') {
      const deleteResult: DeleteResult = await listRepository
        .createQueryBuilder()
        .delete()
        .from(List)
        .where(`${by} = :data`, { data: data })
        .execute();
      if (!deleteResult || deleteResult.affected === 0) {
        return false;
      }
      return true;
    } else {
      return false;
    }
  }

  async exists(name: string, boardId: string): Promise<boolean> {
    const listRepository = getRepository(List);
    const lists = await listRepository
      .createQueryBuilder('list')
      .leftJoinAndSelect('list.board', 'board')
      .where('list.name = :name', { name: name })
      .andWhere('board.id = :bid', { bid: boardId })
      .getMany();
    if (lists.length === 0 || !lists) {
      return false;
    }
    return true;
  }

  async delete(id: string, boardId: string): Promise<boolean> {
    const listRepository = getRepository(List);
    const deleteResult: DeleteResult = await listRepository
      .createQueryBuilder()
      .delete()
      .from(List)
      .where('id = :id', { id: id })
      .andWhere('boardId = :bid', { bid: boardId })
      .execute();
    if (!deleteResult || deleteResult.affected === 0) {
      return false;
    }
    return true;
  }

  async getOneById(
    id: string,
    requesterId: string,
    boardId?: string,
  ): Promise<ListModel> {
    const listRepository = getRepository(List);
    let list: List;
    if (Checking.isEmpty(boardId)) {
      list = await listRepository
        .createQueryBuilder('list')
        .leftJoinAndSelect('list.board', 'board')
        .leftJoin('board.members', 'member')
        .leftJoin('member.user', 'user')
        .where('list.id = :id', { id: id })
        .andWhere('user.id = :uid', { uid: requesterId })
        .getOne();
    } else {
      list = await listRepository
        .createQueryBuilder('list')
        .leftJoinAndSelect('list.board', 'board')
        .leftJoin('board.members', 'member')
        .leftJoin('member.user', 'user')
        .where('list.id = :id', { id: id })
        .andWhere('board.id = :bid', { bid: boardId })
        .andWhere('user.id = :uid', { uid: requesterId })
        .getOne();
    }
    return this.ormToModel(list);
  }

  async save(
    list: ListModel | ListModel[],
    boardId: string,
  ): Promise<List | List[]> {
    const listRepository = getRepository(List);
    const models = Array.isArray(list) ? list : [list];
    const ormEntities = models.map((model) => this.modelToOrm(model, boardId));
    const result = await listRepository.save(ormEntities);
    return result;
  }

  private modelToOrm(model: ListModel, boardId: string): List {
    const properties = model.getProperties();
    const boardOrm = new Board(boardId);
    return {
      id: properties.id,
      name: properties.name,
      color: properties.color,
      order: properties.order,
      board: boardOrm,
    };
  }

  private ormToModel(ormEntity: List): ListModel | null {
    if (!ormEntity) {
      return null;
    }
    return this.listFactory.reconstitute({
      id: ormEntity.id,
      name: ormEntity.name,
      color: ormEntity.color,
      order: ormEntity.order,
    });
  }
}
