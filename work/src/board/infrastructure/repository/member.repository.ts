import { Inject } from '@nestjs/common';
import { MemberRepositoryPort } from 'src/board/domain/database/member.repository.port';
import { MemberFactory } from 'src/board/domain/member.factory';
import { MemberModel } from 'src/board/domain/model/member.model';
import { DeleteResult, getRepository } from 'typeorm';
import { Board } from '../entity/board.orm-entity';
import { Member } from '../entity/member.orm-entity';
import { IdTypes } from 'src/libs/id.type';

export class MemberRepositoryAdapter implements MemberRepositoryPort {
  constructor(@Inject(MemberFactory) private memberFactory: MemberFactory) {}

  async findOneByUserId(userId: string, boardId: string): Promise<MemberModel> {
    const memberRepository = getRepository(Member);
    const member = await memberRepository
      .createQueryBuilder('member')
      .leftJoinAndSelect('member.board', 'board')
      .where('member.userId = :id', { id: userId })
      .andWhere('board.id = :bid', { bid: boardId })
      .getOne();
    return this.ormToModel(member);
  }

  async deleteMany(by: IdTypes, data: string): Promise<boolean> {
    const memberRepository = getRepository(Member);
    if (by === 'boardId') {
      const deleteResult: DeleteResult = await memberRepository
        .createQueryBuilder()
        .delete()
        .from(Member)
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

  async exists(userId: string, boardId: string): Promise<boolean> {
    const memberRepository = getRepository(Member);
    const members = await memberRepository
      .createQueryBuilder('member')
      .leftJoin('member.board', 'board')
      .where('member.userId = :uid', { uid: userId })
      .where('board.id = :bid', { bid: boardId })
      .getMany();
    if (members.length === 0 || !members) {
      return false;
    }
    return true;
  }

  async getOneById(id: string, boardId: string): Promise<MemberModel | null> {
    const memberRepository = getRepository(Member);
    const member = await memberRepository
      .createQueryBuilder('member')
      .leftJoinAndSelect('member.board', 'board')
      .where('member.id = :id', { id: id })
      .andWhere('board.id = :bid', { bid: boardId })
      .getOne();
    return this.ormToModel(member);
  }

  async save(
    member: MemberModel | MemberModel[],
    boardId: string,
  ): Promise<Member | Member[]> {
    const memberRepository = getRepository(Member);
    const models = Array.isArray(member) ? member : [member];
    const ormEntities = models.map((model) => this.modelToOrm(model, boardId));
    const result = await memberRepository.save(ormEntities);
    return result;
  }

  async delete(id: string, boardId: string): Promise<boolean> {
    const memberRepository = getRepository(Member);
    const deleteResult: DeleteResult = await memberRepository
      .createQueryBuilder()
      .delete()
      .from(Member)
      .where('id = :id', { id: id })
      .andWhere('boardId = :bid', { bid: boardId })
      .execute();
    if (!deleteResult || deleteResult.affected === 0) {
      return false;
    }
    return true;
  }

  private ormToModel(ormEntity: Member): MemberModel | null {
    if (!ormEntity) {
      return null;
    }
    return this.memberFactory.reconstitute({
      id: ormEntity.id,
      userId: ormEntity.board.id,
    });
  }

  private modelToOrm(model: MemberModel, boardId: string): Member {
    const properties = model.getProperties();
    const boardOrm = new Board(boardId);
    return {
      id: properties.id,
      board: boardOrm,
      userId: properties.userId,
    };
  }
}
