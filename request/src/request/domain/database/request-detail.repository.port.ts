import { AbsenceType } from 'src/request/infrastructure/entity/absence-type.orm-entity';
import { RequestDetailType } from '../model/request-detail.model';
import { RequestType } from '../request.type';

export interface RequestDetailRepositoryPort {
  getOneById(id: string, type: RequestType): Promise<any>;
  save(
    data: RequestDetailType,
    type: RequestType,
    requestId: string,
    requesterId: string,
  ): Promise<void>;
  delete(id: string, type: RequestType): Promise<void>;
  getAbsenceTypes(userId: string): Promise<AbsenceType[]>;
}
