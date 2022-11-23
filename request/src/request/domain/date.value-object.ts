import { InvalidValueError } from './error/request.error';

export type Time = Required<{
  readonly hour: number;
  readonly minute: number;
}>;

export class DateValueObject {
  public startAt: Date;
  public endAt: Date;

  constructor(startAt: Date, endAt: Date) {
    this.startAt = startAt;
    this.endAt = endAt;
    this.validate();
  }

  private validate(): void {
    if (this.startAt.getTime() <= new Date().getTime())
      throw new InvalidValueError();
    if (this.startAt.getTime() >= this.endAt.getTime())
      throw new InvalidValueError();
  }

  // private isValidTime(time: Time): boolean {
  //   const isValidTime =
  //     time.hour >= 0 &&
  //     time.hour <= 23 &&
  //     time.minute >= 0 &&
  //     time.minute <= 59;
  //   if (isValidTime) {
  //     return true;
  //   }
  //   return false;
  // }

  // private isValidDate(dateTimestamp: string): boolean {
  //   const dueDate = new Date(dateTimestamp);
  //   if (isNaN(dueDate.valueOf())) {
  //     return false;
  //   }
  //   if (dueDate.getTime() <= new Date().getTime()) {
  //     return false;
  //   }
  //   return true;
  // }
}
