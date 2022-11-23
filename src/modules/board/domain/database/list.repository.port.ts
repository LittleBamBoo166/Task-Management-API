import { List } from 'src/infrastructure/entity/list.orm-entity';
import { IdTypes } from 'src/libs/type/id.type';
import { ListModel } from '../model/list.model';

export interface ListRepositoryPort {
  inTheSameBoard(id1: string, id2: string): Promise<boolean>;
  getOneById(
    id: string,
    requesterId: string,
    boardId?: string,
  ): Promise<ListModel>;
  exists(name: string, boardId: string): Promise<boolean>;
  save(list: ListModel | ListModel[], boardId: string): Promise<List | List[]>;
  delete(id: string, boardId: string): Promise<boolean>;
  deleteMany(by: IdTypes, data: string): Promise<boolean>;
}
