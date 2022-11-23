import { Inject } from '@nestjs/common';
import { IdTypes } from 'src/libs/id.type';
import { LabelRepositoryPort } from 'src/board/domain/database/label.repository.port';
import { LabelFactory } from 'src/board/domain/label.factory';
import { LabelModel } from 'src/board/domain/model/label.model';
import { DeleteResult, getRepository } from 'typeorm';
import { Board } from '../entity/board.orm-entity';
import { Label } from '../entity/label.orm-entity';

export class LabelRepositoryAdapter implements LabelRepositoryPort {
  constructor(
    @Inject(LabelFactory) private readonly labelFactory: LabelFactory,
  ) {}

  async deleteMany(by: IdTypes, data: string): Promise<boolean> {
    const labelRepository = getRepository(Label);
    if (by === 'boardId') {
      const deleteResult: DeleteResult = await labelRepository
        .createQueryBuilder()
        .delete()
        .from(Label)
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

  async getOneById(id: string, boardId: string): Promise<LabelModel> {
    const labelRepository = getRepository(Label);
    const label = await labelRepository
      .createQueryBuilder('label')
      .leftJoin('label.board', 'board')
      .where('label.id = :id', { id: id })
      .andWhere('board.id = :bid', { bid: boardId })
      .getOne();
    return this.ormToModel(label);
  }

  async exists(name: string, boardId: string): Promise<boolean> {
    const labelRepository = getRepository(Label);
    const label = await labelRepository
      .createQueryBuilder('label')
      .leftJoin('label.board', 'board')
      .where('label.name = :name', { name: name })
      .andWhere('board.id = :bid', { bid: boardId })
      .getOne();
    if (!label) {
      return false;
    }
    return true;
  }

  async save(
    label: LabelModel | LabelModel[],
    boardId: string,
  ): Promise<Label | Label[]> {
    const labelRepository = getRepository(Label);
    const models = Array.isArray(label) ? label : [label];
    const ormEntities = models.map((model) => this.modelToOrm(model, boardId));
    const result = await labelRepository.save(ormEntities);
    return result;
  }

  async delete(id: string, boardId: string): Promise<boolean> {
    const labelRepository = getRepository(Label);
    const deleteResult: DeleteResult = await labelRepository
      .createQueryBuilder()
      .delete()
      .from(Label)
      .where('id = :id', { id: id })
      .andWhere('boardId = :bid', { bid: boardId })
      .execute();
    if (!deleteResult || deleteResult.affected === 0) {
      return false;
    }
    return true;
  }

  private modelToOrm(model: LabelModel, boardId: string): Label {
    const properties = model.getProperties();
    const boardOrm = new Board(boardId);
    return {
      id: properties.id,
      name: properties.name,
      color: properties.color,
      board: boardOrm,
    };
  }

  private ormToModel(ormEntity: Label): LabelModel | null {
    if (!ormEntity) {
      return null;
    }
    return this.labelFactory.reconstitute({
      id: ormEntity.id,
      name: ormEntity.name,
      color: ormEntity.color,
    });
  }
}
