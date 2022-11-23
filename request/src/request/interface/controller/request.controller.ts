import {
  ClassSerializerInterceptor,
  Controller,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Post } from '@nestjs/common/decorators/http/request-mapping.decorator';
import {
  Body,
  Req,
} from '@nestjs/common/decorators/http/route-params.decorator';
import { CommandBus } from '@nestjs/cqrs';
import { QueryBus } from '@nestjs/cqrs/dist';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/request/application/auth.guard';
import { CreatePaymentRequestCommand } from 'src/request/application/command/impl/create-payment-request.command';
import { CreateReworkRequestCommand } from 'src/request/application/command/impl/create-rework-request.command';
import { CreateWorkOvertimeRequestCommand } from 'src/request/application/command/impl/create-work-overtime-request.command';
import RequestWithUser from 'src/request/application/request-with-user';
import { CreatePaymentRequestRequest } from '../dto/create-payment-request.request';
import { CreateReworkRequestRequest } from '../dto/create-rework-request.request';
import { CreateWorkOvertimeRequestRequest } from '../dto/create-work-overtime-request.request';

@ApiTags('request')
@UseGuards(AuthGuard)
@Controller('request')
@UseInterceptors(ClassSerializerInterceptor)
export class RequestController {
  constructor(readonly commandBus: CommandBus, readonly queryBus: QueryBus) {}

  @ApiBody({ type: CreateReworkRequestRequest })
  @Post('rework-request')
  async createReworkRequest(
    @Body() body: CreateReworkRequestRequest,
    @Req() req: RequestWithUser,
  ) {
    const command = new CreateReworkRequestCommand(
      body.message,
      body.approverId,
      body.ccTo,
      body.dateOffStart,
      body.dateOffEnd,
      body.reworkDateStart,
      body.reworkDateEnd,
      req.user.id,
    );
    return this.commandBus.execute(command);
  }

  @ApiBody({ type: CreatePaymentRequestRequest })
  @Post('payment-request')
  async createPaymentRequest(
    @Body() body: CreatePaymentRequestRequest,
    @Req() req: RequestWithUser,
  ) {
    const command = new CreatePaymentRequestCommand(
      body.message,
      body.approverId,
      body.ccTo,
      body.type,
      body.amount,
      body.receivedDate,
      body.paymentDetail,
      body.fileName,
      body.storageUri,
      req.user.id,
    );
    return this.commandBus.execute(command);
  }

  @ApiBody({ type: CreateWorkOvertimeRequestRequest })
  @Post('work-overtime-request')
  async createWorkOvertimeRequest(
    @Body() body: CreateWorkOvertimeRequestRequest,
    @Req() req: RequestWithUser,
  ) {
    const command = new CreateWorkOvertimeRequestCommand(
      body.message,
      body.approverId,
      body.ccTo,
      body.date,
      req.user.id,
    );
    return this.commandBus.execute(command);
  }
}
