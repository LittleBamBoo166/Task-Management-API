export class CreatePaymentRequestCommand {
  readonly message: string;
  readonly approverId: string;
  readonly ccTo: string[];
  readonly type: string;
  readonly amount: number;
  readonly receivedDate: string;
  readonly paymentDetail: string;
  readonly fileName: string;
  readonly storageUri: string;
  readonly requesterId: string;

  constructor(
    message: string,
    approverId: string,
    ccTo: string[],
    type: string,
    amount: number,
    receivedDate: string,
    paymentDetail: string,
    fileName: string,
    storageUri: string,
    requesterId: string,
  ) {
    this.message = message;
    this.approverId = approverId;
    this.ccTo = ccTo;
    this.type = type;
    this.amount = amount;
    this.receivedDate = receivedDate;
    this.paymentDetail = paymentDetail;
    this.fileName = fileName;
    this.storageUri = storageUri;
    this.requesterId = requesterId;
  }
}
