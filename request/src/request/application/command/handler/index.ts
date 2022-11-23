import { CreatePaymentRequestHandler } from './create-payment-request.handler';
import { CreateReworkRequestHandler } from './create-rework-request.handler';

export const commandHandler = [
  CreateReworkRequestHandler,
  CreatePaymentRequestHandler,
];
