import { Label } from 'src/infrastructure/entity/label.orm-entity';
import { IdTypes } from 'src/libs/type/id.type';
import { LabelModel } from '../model/label.model';

export interface LabelRepositoryPort {
  getOneById(id: string, boardId: string): Promise<LabelModel>;
  exists(name: string, boardId: string): Promise<boolean>;
  save(
    label: LabelModel | LabelModel[],
    boardId: string,
  ): Promise<Label | Label[]>;
  delete(id: string, boardId: string): Promise<boolean>;
  deleteMany(by: IdTypes, data: string): Promise<boolean>;
}
