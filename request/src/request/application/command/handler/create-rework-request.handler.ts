import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateReworkRequestCommand } from '../impl/create-rework-request.command';
// import { Ok, Err, Result } from 'oxide.ts';
import { IdResponse } from 'src/request/interface/dto/id.response';
import { Inject } from '@nestjs/common';
import { InjectionToken } from '../../injection.token';
import { RequestRepositoryPort } from 'src/request/domain/database/request.repository.port';
import { RequestFactory } from 'src/request/domain/request.factory';
import {
  RequestType,
  ReworkRequestType,
  StageType,
  StatusType,
} from 'src/request/domain/request.type';
import { DateValueObject } from 'src/request/domain/date.value-object';
import { RequestDetailRepositoryPort } from 'src/request/domain/database/request-detail.repository.port';

@CommandHandler(CreateReworkRequestCommand)
export class CreateReworkRequestHandler
  implements ICommandHandler<CreateReworkRequestCommand, IdResponse>
{
  constructor(
    @Inject(InjectionToken.REQUEST_REPOSITORY)
    private readonly requestRepository: RequestRepositoryPort,
    @Inject(InjectionToken.REQUEST_DETAIL_REPOSITORY)
    private readonly requestDetailRepository: RequestDetailRepositoryPort,
    private readonly requestFactory: RequestFactory,
  ) {}

  async execute(command: CreateReworkRequestCommand): Promise<IdResponse> {
    const requestModel = this.requestFactory.create({
      type: RequestType.REWORK_REQUEST,
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
    const requestDetail: ReworkRequestType = {
      dateOff: new DateValueObject(
        new Date(command.dateOffStart),
        new Date(command.dateOffEnd),
      ),
      reworkDate: new DateValueObject(
        new Date(command.reworkDateStart),
        new Date(command.reworkDateEnd),
      ),
    };
    await this.requestRepository.save(requestModel);
    await this.requestDetailRepository.save(
      requestDetail,
      RequestType.REWORK_REQUEST,
      requestModel.id,
      command.requesterId,
    );
    return new IdResponse(requestModel.id);
  }
}
