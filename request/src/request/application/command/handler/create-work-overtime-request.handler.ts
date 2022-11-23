import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RequestDetailRepositoryPort } from 'src/request/domain/database/request-detail.repository.port';
import { RequestRepositoryPort } from 'src/request/domain/database/request.repository.port';
import { DateValueObject } from 'src/request/domain/date.value-object';
import { RequestFactory } from 'src/request/domain/request.factory';
import {
  RequestType,
  StageType,
  StatusType,
  WorkOvertimeRequestType,
} from 'src/request/domain/request.type';
import { IdResponse } from 'src/request/interface/dto/id.response';
import { InjectionToken } from '../../injection.token';
import { CreateWorkOvertimeRequestCommand } from '../impl/create-work-overtime-request.command';

@CommandHandler(CreateWorkOvertimeRequestCommand)
export class CreateWorkOvertimeRequestHandler
  implements ICommandHandler<CreateWorkOvertimeRequestCommand, IdResponse>
{
  constructor(
    @Inject(InjectionToken.REQUEST_REPOSITORY)
    private readonly requestRepository: RequestRepositoryPort,
    @Inject(InjectionToken.REQUEST_DETAIL_REPOSITORY)
    private readonly requestDetailRepository: RequestDetailRepositoryPort,
    private readonly requestFactory: RequestFactory,
  ) {}

  async execute(
    command: CreateWorkOvertimeRequestCommand,
  ): Promise<IdResponse> {
    const requestModel = this.requestFactory.create({
      type: RequestType.WORK_OVERTIME_REQUEST,
      message: command.message,
      status: StatusType.PENDING,
      stage: StageType.IN_PROGRESS,
      requesterId: command.requesterId,
      ccTo: command.ccTo,
      approver: [
        {
          userId: command.approverId,
          order: 1,
          isDefault: false,
        },
      ],
    });
    const overtimeDate: DateValueObject[] = command.date.map(
      (item) => new DateValueObject(new Date(item[0]), new Date(item[1])),
    );
    const requestDetail: WorkOvertimeRequestType = {
      date: overtimeDate,
    };
    await this.requestRepository.save(requestModel);
    await this.requestDetailRepository.save(
      requestDetail,
      RequestType.WORK_OVERTIME_REQUEST,
      requestModel.id,
      command.requesterId,
    );
    return new IdResponse(requestModel.id);
  }
}
