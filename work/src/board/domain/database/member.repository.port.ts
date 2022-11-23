import { Member } from 'src/board/infrastructure/entity/member.orm-entity';
import { IdTypes } from 'src/libs/id.type';
import { MemberModel } from '../model/member.model';

export interface MemberRepositoryPort {
  findOneByUserId(userId: string, boardId: string): Promise<MemberModel>;
  exists(userId: string, boardId: string): Promise<boolean>;
  getOneById(id: string, boardId: string): Promise<MemberModel>;
  save(
    member: MemberModel | MemberModel[],
    boardId: string,
  ): Promise<Member | Member[]>;
  delete(id: string, boardId: string): Promise<boolean>;
  deleteMany(by: IdTypes, data: string): Promise<boolean>;
}
