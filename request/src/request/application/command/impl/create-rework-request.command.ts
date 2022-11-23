export class CreateReworkRequestCommand {
  // readonly message: string;
  // readonly approverId: string;
  // readonly ccTo: string[];
  // readonly dateOffStart: string;
  // readonly dateOffEnd: string;
  // readonly reworkDateStart: string;
  // readonly reworkDateEnd: string;
  // readonly requesterId: string;

  constructor(
    public readonly message: string,
    public readonly approverId: string,
    public readonly ccTo: string[],
    public readonly dateOffStart: string,
    public readonly dateOffEnd: string,
    public readonly reworkDateStart: string,
    public readonly reworkDateEnd: string,
    public readonly requesterId: string,
  ) {
    // this.message = message;
    // this.approverId = approverId;
    // this.ccTo = ccTo;
    // this.dateOffStart = dateOffStart;
    // this.dateOffEnd = dateOffEnd;
    // this.reworkDateStart = reworkDateStart;
    // this.reworkDateEnd = reworkDateEnd;
    // this.requesterId = requesterId;
  }
}
