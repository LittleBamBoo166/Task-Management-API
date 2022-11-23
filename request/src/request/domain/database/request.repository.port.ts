import { RequestModel } from '../model/request.model';

export interface RequestRepositoryPort {
  getOneById(id: string): Promise<RequestModel>;
  save(model: RequestModel | RequestModel[]): Promise<void>;
  delete(id: string): Promise<boolean>;
  getPendingRequest(userId: string): Promise<RequestModel[]>;
  getMyRequest(userId: string): Promise<RequestModel[]>;
  getCcRequest(userId: string): Promise<RequestModel[]>;
}
