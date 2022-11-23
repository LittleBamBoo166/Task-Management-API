import { RequestDetailRepositoryPort } from 'src/request/domain/database/request-detail.repository.port';
import { RequestDetailType } from 'src/request/domain/model/request-detail.model';
import {
  AbsenceRequestType,
  BusinessTravelRequestType,
  ChangeShiftRequestType,
  EquipmentRequestType,
  LeavingRequestType,
  PaymentRequestType,
  RequestType,
  ReworkRequestType,
  SalaryAndBenefitsRequestType,
  WorkOvertimeRequestType,
} from 'src/request/domain/request.type';
import { getRepository } from 'typeorm/globals';
import { AbsenceRequest } from '../entity/absence-request.orm-entity';
import { AbsenceType } from '../entity/absence-type.orm-entity';
import { BusinessTravelRequest } from '../entity/business-travel-request.orm-entity';
import { ChangeShiftRequest } from '../entity/change-shift-request.orm-entity';
import { EquipmentRequest } from '../entity/equipment-request.orm-entity';
import { LeavingRequest } from '../entity/leaving-request.orm-entity';
import { PaymentRequest } from '../entity/payment-request.orm-entity';
import { Product } from '../entity/product.orm-entity';
import { ReworkRequest } from '../entity/rework-request.orm-entity';
import { SalaryAndBenefitsRequest } from '../entity/salary-and-benefits-request.orm-entity';
import { WorkOverTimeRequest } from '../entity/work-over-time-request.orm-entity';

export class RequestDetailRepositoryAdapter
  implements RequestDetailRepositoryPort
{
  async getOneById(id: string, type: RequestType): Promise<any> {
    switch (type) {
      case RequestType.ABSENCE_REQUEST:
        const absenctRequestRepository = getRepository(AbsenceRequest);
        return absenctRequestRepository.findOneBy({ requestId: id });
      case RequestType.BUSINESS_TRAVEL_REQUEST:
        const businessTravelRequestRepository = getRepository(
          BusinessTravelRequest,
        );
        return businessTravelRequestRepository.findOneBy({ requestId: id });
      case RequestType.CHANGE_SHIFT_REQUEST:
        const changeShiftRequestRepository = getRepository(ChangeShiftRequest);
        return changeShiftRequestRepository.findOneBy({ requestId: id });
      case RequestType.EQUIPMENT_REQUEST:
        const equipmentRequestRepository = getRepository(EquipmentRequest);
        return equipmentRequestRepository
          .createQueryBuilder(RequestType.EQUIPMENT_REQUEST)
          .leftJoinAndSelect(
            `${RequestType.EQUIPMENT_REQUEST}.products`,
            'products',
          )
          .where(`${RequestType.EQUIPMENT_REQUEST}.requestId = :id`, { id: id })
          .getOne();
      case RequestType.LEAVING_REQUEST:
        const leavingRequestRepository = getRepository(LeavingRequest);
        return leavingRequestRepository.findOneBy({ requestId: id });
      case RequestType.PAYMENT_REQUEST:
        const paymentRequestRepository = getRepository(PaymentRequest);
        return paymentRequestRepository.findOneBy({ requestId: id });
      case RequestType.REWORK_REQUEST:
        const reworkRequestRepository = getRepository(ReworkRequest);
        return reworkRequestRepository.findOneBy({ requestId: id });
      case RequestType.SALARY_REQUEST:
        const salaryRequestRepository = getRepository(SalaryAndBenefitsRequest);
        return salaryRequestRepository.findOneBy({ requestId: id });
      case RequestType.WORK_OVERTIME_REQUEST:
        const workOvertimeRepository = getRepository(WorkOverTimeRequest);
        return workOvertimeRepository.findOneBy({ requestId: id });
      default:
        break;
    }
  }

  async delete(id: string, type: RequestType): Promise<void> {
    switch (type) {
      case RequestType.ABSENCE_REQUEST:
        const absenctRequestRepository = getRepository(AbsenceRequest);
        await absenctRequestRepository
          .createQueryBuilder()
          .delete()
          .from(AbsenceRequest)
          .where('requestId = :id', { id: id })
          .execute();
        break;
      case RequestType.BUSINESS_TRAVEL_REQUEST:
        const businessTravelRequestRepository = getRepository(
          BusinessTravelRequest,
        );
        await businessTravelRequestRepository
          .createQueryBuilder()
          .delete()
          .from(BusinessTravelRequest)
          .where('requestId = :id', { id: id })
          .execute();
        break;
      case RequestType.CHANGE_SHIFT_REQUEST:
        const changeShiftRequestRepository = getRepository(ChangeShiftRequest);
        await changeShiftRequestRepository
          .createQueryBuilder()
          .delete()
          .from(ChangeShiftRequest)
          .where('requestId = :id', { id: id })
          .execute();
        break;
      case RequestType.EQUIPMENT_REQUEST:
        const equipmentRequestRepository = getRepository(EquipmentRequest);
        await equipmentRequestRepository
          .createQueryBuilder()
          .delete()
          .from(EquipmentRequest)
          .where('requestId = :id', { id: id })
          .execute();
      case RequestType.LEAVING_REQUEST:
        const leavingRequestRepository = getRepository(LeavingRequest);
        await leavingRequestRepository
          .createQueryBuilder()
          .delete()
          .from(LeavingRequest)
          .where('requestId = :id', { id: id })
          .execute();
      case RequestType.PAYMENT_REQUEST:
        const paymentRequestRepository = getRepository(PaymentRequest);
        await paymentRequestRepository
          .createQueryBuilder()
          .delete()
          .from(PaymentRequest)
          .where('requestId = :id', { id: id })
          .execute();
      case RequestType.REWORK_REQUEST:
        const reworkRequestRepository = getRepository(ReworkRequest);
        await reworkRequestRepository
          .createQueryBuilder()
          .delete()
          .from(ReworkRequest)
          .where('requestId = :id', { id: id })
          .execute();
      case RequestType.SALARY_REQUEST:
        const salaryRequestRepository = getRepository(SalaryAndBenefitsRequest);
        await salaryRequestRepository
          .createQueryBuilder()
          .delete()
          .from(SalaryAndBenefitsRequest)
          .where('requestId = :id', { id: id })
          .execute();
      case RequestType.WORK_OVERTIME_REQUEST:
        const workOvertimeRepository = getRepository(WorkOverTimeRequest);
        await workOvertimeRepository
          .createQueryBuilder()
          .delete()
          .from(ReworkRequest)
          .where('requestId = :id', { id: id })
          .execute();
      default:
        break;
    }
    throw new Error('Method not implemented.');
  }

  async save(
    data: RequestDetailType,
    type: RequestType,
    requestId: string,
    requesterId: string,
  ): Promise<void> {
    switch (type) {
      case RequestType.EQUIPMENT_REQUEST:
        await this.saveEquipmentRequest(
          data as EquipmentRequestType,
          requestId,
        );
        break;
      case RequestType.ABSENCE_REQUEST:
        await this.saveAbsenceRequest(
          data as AbsenceRequestType,
          requestId,
          requesterId,
        );
        break;
      case RequestType.WORK_OVERTIME_REQUEST:
        await this.saveWorkOvertimeRequest(
          data as WorkOvertimeRequestType,
          requestId,
        );
        break;
      case RequestType.SALARY_REQUEST:
        await this.saveSalaryAndBenefitsRequest(
          data as SalaryAndBenefitsRequestType,
          requestId,
        );
        break;
      case RequestType.BUSINESS_TRAVEL_REQUEST:
        await this.saveBusinessTravelRequest(
          data as BusinessTravelRequestType,
          requestId,
        );
        break;
      case RequestType.CHANGE_SHIFT_REQUEST:
        await this.saveChangeShiftRequest(
          data as ChangeShiftRequestType,
          requestId,
        );
        break;
      case RequestType.REWORK_REQUEST:
        await this.saveReworkRequest(data as ReworkRequestType, requestId);
        break;
      case RequestType.PAYMENT_REQUEST:
        await this.savePaymentRequest(data as PaymentRequestType, requestId);
        break;
      case RequestType.LEAVING_REQUEST:
        await this.saveLeavingRequest(data as LeavingRequestType, requestId);
        break;
      default:
        break;
    }
  }

  async getAbsenceTypes(userId: string): Promise<AbsenceType[]> {
    const repository = getRepository(AbsenceType);
    return repository.findBy({ userId: userId });
  }

  private async saveLeavingRequest(
    data: LeavingRequestType,
    requestId: string,
  ) {
    const repository = getRepository(LeavingRequest);
    const ormEntity = repository.create({ requestId: requestId, ...data });
    await repository.save(ormEntity);
  }

  private async savePaymentRequest(
    data: PaymentRequestType,
    requestId: string,
  ) {
    const repository = getRepository(PaymentRequest);
    const ormEntity = repository.create({ requestId: requestId, ...data });
    await repository.save(ormEntity);
  }

  private async saveReworkRequest(data: ReworkRequestType, requestId: string) {
    const repository = getRepository(ReworkRequest);
    const ormEntity = repository.create({ requestId: requestId, ...data });
    await repository.save(ormEntity);
  }

  private async saveChangeShiftRequest(
    data: ChangeShiftRequestType,
    requestId: string,
  ) {
    const repository = getRepository(ChangeShiftRequest);
    const ormEntity = repository.create({ requestId: requestId, ...data });
    await repository.save(ormEntity);
  }

  private async saveBusinessTravelRequest(
    data: BusinessTravelRequestType,
    requestId: string,
  ) {
    const repository = getRepository(BusinessTravelRequest);
    const ormEntity = repository.create({ requestId: requestId, ...data });
    await repository.save(ormEntity);
  }

  private async saveSalaryAndBenefitsRequest(
    data: SalaryAndBenefitsRequestType,
    requestId: string,
  ) {
    const repository = getRepository(SalaryAndBenefitsRequest);
    const ormEntity = repository.create({ requestId: requestId, ...data });
    await repository.save(ormEntity);
  }

  private async saveWorkOvertimeRequest(
    data: WorkOvertimeRequestType,
    requestId: string,
  ) {
    const repository = getRepository(WorkOverTimeRequest);
    const ormEntity = repository.create({ requestId: requestId, ...data });
    await repository.save(ormEntity);
  }

  private async saveAbsenceRequest(
    data: AbsenceRequestType,
    requestId: string,
    requesterId: string,
  ) {
    const absenceTypeRepository = getRepository(AbsenceType);
    await absenceTypeRepository
      .createQueryBuilder()
      .update(AbsenceType)
      .set({ remainingDate: data.type.remainingDate })
      .where('name = :name', { name: data.type.name })
      .andWhere('userId = :uid', { userId: requesterId })
      .execute();
    const repository = getRepository(AbsenceRequest);
    const ormEntity = repository.create({ requestId: requestId, ...data });
    await repository.save(ormEntity);
  }

  private async saveEquipmentRequest(
    data: EquipmentRequestType,
    requestId: string,
  ) {
    const requestRepository = getRepository(EquipmentRequest);
    const productRepository = getRepository(Product);
    const productOrmEntities = data.products.map((item) =>
      productRepository.create({ ...item }),
    );
    const requestOrmEntity = requestRepository.create({
      ...data,
      requestId: requestId,
    });
    requestOrmEntity.products = productOrmEntities;
    await productRepository.save(productOrmEntities);
    await requestRepository.save(requestOrmEntity);
  }
}
