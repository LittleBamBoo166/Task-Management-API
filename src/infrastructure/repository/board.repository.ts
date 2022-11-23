import { Inject } from '@nestjs/common';
import { Checking } from 'src/libs/util/checking';
import { BoardFactory } from 'src/modules/board/domain/board.factory';
import { BoardRepositoryPort } from 'src/modules/board/domain/database/board.repository.port';
import { LabelFactory } from 'src/modules/board/domain/label.factory';
import { ListFactory } from 'src/modules/board/domain/list.factory';
import { MemberFactory } from 'src/modules/board/domain/member.factory';
import { BoardModel } from 'src/modules/board/domain/model/board.model';
import { DeleteResult, getRepository } from 'typeorm';
import { Board } from '../entity/board.orm-entity';
import { User } from '../entity/user.orm-entity';

export class BoardRepositoryAdapter implements BoardRepositoryPort {
  constructor(
    @Inject(BoardFactory) private readonly boardFactory: BoardFactory,
    @Inject(ListFactory) private readonly listFactory: ListFactory,
    @Inject(MemberFactory) private readonly memberFactory: MemberFactory,
    @Inject(LabelFactory) private readonly labelFactory: LabelFactory,
  ) {}

  async getDetailById(id: string): Promise<BoardModel> {
    const boardRepository = getRepository(Board);
    const board = await boardRepository
      .createQueryBuilder('board')
      .leftJoinAndSelect('board.owner', 'owner')
      .leftJoinAndSelect('board.lists', 'list')
      .leftJoinAndSelect('board.labels', 'label')
      .leftJoinAndSelect('board.members', 'member')
      .leftJoinAndSelect('member.user', 'user')
      .where('board.id = :bid', { bid: id })
      .getOne();
    return this.ormToModel(board);
  }

  async getOneById(id: string, requesterId: string): Promise<BoardModel> {
    const boardRepository = getRepository(Board);
    const board = await boardRepository
      .createQueryBuilder('board')
      .leftJoinAndSelect('board.owner', 'owner')
      .leftJoin('board.members', 'member')
      .leftJoin('member.user', 'user')
      .where('board.id = :bid', { bid: id })
      .andWhere('user.id = :uid', { uid: requesterId })
      .getOne();
    return this.ormToModel(board);
  }

  async isBoardOwner(id: string, requesterId: string): Promise<boolean> {
    const boardRepository = getRepository(Board);
    const owner = await boardRepository
      .createQueryBuilder('board')
      .leftJoinAndSelect('board.owner', 'user')
      .where('user.id = :uid', { uid: requesterId })
      .andWhere('board.id = :id', { id: id })
      .getOne();
    if (!owner) {
      return false;
    }
    return true;
  }

  async hasMember(id: string, requesterId: string): Promise<boolean> {
    const boardRepository = getRepository(Board);
    const member = await boardRepository
      .createQueryBuilder('board')
      .leftJoinAndSelect('board.members', 'member')
      .leftJoin('member.user', 'user')
      .where('user.id = :uid', { uid: requesterId })
      .andWhere('board.id = :id', { id: id })
      .getOne();
    if (!member) {
      return false;
    }
    return true;
  }

  async exists(name: string, requesterId: string): Promise<boolean> {
    const boardRepository = getRepository(Board);
    const boards = await boardRepository
      .createQueryBuilder('board')
      .leftJoinAndSelect('board.owner', 'user')
      .where('user.id = :id', { id: requesterId })
      .andWhere('board.name = :name', { name: name })
      .getMany();
    if (boards.length === 0 || !boards) {
      return false;
    }
    return true;
  }

  async save(board: BoardModel): Promise<Board> {
    const boardRepository = getRepository(Board);
    const boardOrm = this.modelToOrm(board);
    const result = await boardRepository.save(boardOrm);
    return result;
  }
  async delete(id: string, requesterId: string): Promise<boolean> {
    const boardRepository = getRepository(Board);
    const deleteResult: DeleteResult = await boardRepository
      .createQueryBuilder()
      .delete()
      .from(Board)
      .where('id = :id', { id: id })
      .andWhere('ownerId = :oid', { oid: requesterId })
      .execute();
    if (Checking.isEmpty(deleteResult) || deleteResult.affected === 0) {
      return false;
    } else {
      return true;
    }
  }
  async getByMember(requesterId: string): Promise<BoardModel[]> {
    const boardRepository = getRepository(Board);
    const boards = await boardRepository
      .createQueryBuilder('board')
      .leftJoinAndSelect('board.owner', 'owner')
      .leftJoinAndSelect('board.members', 'member')
      .leftJoinAndSelect('member.user', 'user')
      .where('user.id = :id', { id: requesterId })
      .getMany();
    return boards.map((board) => this.ormToModel(board));
  }

  private modelToOrm(model: BoardModel): Board {
    const properties = model.getProperties();
    const ownerOrm = new User(properties.ownerId);
    return {
      id: properties.id,
      description: properties.description,
      name: properties.name,
      owner: ownerOrm,
    };
  }

  private ormToModel(ormEntity: Board): BoardModel | null {
    if (!ormEntity) {
      return null;
    }
    const listModels = ormEntity.lists
      ? ormEntity.lists.map((list) =>
          this.listFactory.reconstitute({ ...list }),
        )
      : undefined;
    const memberModels = ormEntity.members
      ? ormEntity.members.map((member) =>
          this.memberFactory.reconstitute({
            id: member.id,
            userId: member.user.id,
          }),
        )
      : undefined;
    const labelModels = ormEntity.labels
      ? ormEntity.labels.map((label) =>
          this.labelFactory.reconstitute({
            ...label,
          }),
        )
      : undefined;
    return this.boardFactory.reconstitute({
      id: ormEntity.id,
      description: ormEntity.description,
      name: ormEntity.name,
      ownerId: ormEntity.owner.id,
      lists: listModels,
      labels: labelModels,
      members: memberModels,
    });
  }
}
