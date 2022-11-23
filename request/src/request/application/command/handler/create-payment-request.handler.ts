import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RequestDetailRepositoryPort } from 'src/request/domain/database/request-detail.repository.port';
import { RequestRepositoryPort } from 'src/request/domain/database/request.repository.port';
import { RequestFactory } from 'src/request/domain/request.factory';
import {
  PaymentRequestType,
  RequestType,
  StageType,
  StatusType,
} from 'src/request/domain/request.type';
import { IdResponse } from 'src/request/interface/dto/id.response';
import { InjectionToken } from '../../injection.token';
import { CreatePaymentRequestCommand } from '../impl/create-payment-request.command';

@CommandHandler(CreatePaymentRequestCommand)
export class CreatePaymentRequestHandler
  implements ICommandHandler<CreatePaymentRequestCommand, IdResponse>
{
  constructor(
    @Inject(InjectionToken.REQUEST_REPOSITORY)
    private readonly requestRepository: RequestRepositoryPort,
    @Inject(InjectionToken.REQUEST_DETAIL_REPOSITORY)
    private readonly requestDetailRepository: RequestDetailRepositoryPort,
    private readonly requestFactory: RequestFactory,
  ) {}

  async execute(command: CreatePaymentRequestCommand): Promise<IdResponse> {
    const requestModel = this.requestFactory.create({
      type: RequestType.PAYMENT_REQUEST,
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
    const requestDetail: PaymentRequestType = {
      attachmentName: command.fileName,
      attachmentURI: command.storageUri,
      costs: command.amount,
      detail: command.paymentDetail,
      receivedDate: new Date(command.receivedDate),
      type: command.type,
    };
    await this.requestRepository.save(requestModel);
    await this.requestDetailRepository.save(
      requestDetail,
      RequestType.PAYMENT_REQUEST,
      requestModel.id,
      command.requesterId,
    );
    return new IdResponse(requestModel.id);
  }
}
