import { Inject } from '@nestjs/common';
import { RequestRepositoryPort } from 'src/request/domain/database/request.repository.port';
import { RequestModel } from 'src/request/domain/model/request.model';
import { RequestFactory } from 'src/request/domain/request.factory';
import { ApproverType } from 'src/request/domain/request.type';
import { DeleteResult, getRepository } from 'typeorm';
import { Approver } from '../entity/approver.orm-entity';
import { CcToUser } from '../entity/cc-to-user.orm-entity';
import { Request } from '../entity/request.orm-entity';

export class RequestRepositoryAdapter implements RequestRepositoryPort {
  constructor(
    @Inject(RequestFactory) private readonly requestFactory: RequestFactory,
  ) {}

  async getOneById(id: string): Promise<RequestModel> {
    const requestRepository = getRepository(Request);
    const request = await requestRepository
      .createQueryBuilder('request')
      .where('request.id = :id', { id: id })
      .leftJoinAndSelect('request.approvers', 'approver')
      .getOne();
    return this.ormToModel(request);
  }

  async save(model: RequestModel | RequestModel[]): Promise<void> {
    const requestRepository = getRepository(Request);
    const models = Array.isArray(model) ? model : [model];
    const ormEntities = models.map((item) => this.modelToOrm(item));
    await requestRepository.save(ormEntities);
  }

  async delete(id: string): Promise<boolean> {
    const requestRepository = getRepository(Request);
    const deleteResult: DeleteResult = await requestRepository
      .createQueryBuilder()
      .delete()
      .from(Request)
      .where('id = :id', { id: id })
      .execute();
    if (!deleteResult || deleteResult.affected === 0) return false;
    return true;
  }

  async getPendingRequest(userId: string): Promise<RequestModel[]> {
    const requestRepository = getRepository(Request);
    const requests = await requestRepository
      .createQueryBuilder('request')
      .leftJoinAndSelect('request.approvers', 'approver')
      .where('approver.id = :id', { id: userId })
      .getMany();
    return requests.map((request) => this.ormToModel(request));
  }

  async getMyRequest(userId: string): Promise<RequestModel[]> {
    const requestRepository = getRepository(Request);
    const requests = await requestRepository
      .createQueryBuilder('request')
      .where('request.requesterId = :userId', { userId: userId })
      .getMany();
    return requests.map((request) => this.ormToModel(request));
  }

  async getCcRequest(userId: string): Promise<RequestModel[]> {
    const requestRepository = getRepository(Request);
    const requests = await requestRepository
      .createQueryBuilder('request')
      .leftJoinAndSelect('request.ccTo', 'ccToUser')
      .where('ccToUser.userId = :userId', { userId: userId })
      .getMany();
    return requests.map((request) => this.ormToModel(request));
  }

  private modelToOrm(model: RequestModel): Request {
    const properties = model.getProperties();
    const approverRepository = getRepository(Approver);
    const ccToUserRepository = getRepository(CcToUser);
    const approverOrms = properties.approver?.map((item) =>
      approverRepository.create(item),
    );
    const ccToUserOrms = properties.ccTo?.map((item) =>
      ccToUserRepository.create({ userId: item }),
    );
    return {
      ...properties,
      approvers: approverOrms,
      ccTo: ccToUserOrms,
    };
  }

  private ormToModel(ormEntity: Request): RequestModel {
    if (!ormEntity) return null;
    const approvers: ApproverType[] = ormEntity.approvers.map((item) => {
      return {
        userId: item.userId,
        order: item.order,
        isDefault: item.isDefault,
      };
    });
    const ccTo: string[] = ormEntity.ccTo.map((item) => item.userId);
    return this.requestFactory.reconstitute({
      ...ormEntity,
      approver: approvers,
      ccTo: ccTo,
    });
  }
}
