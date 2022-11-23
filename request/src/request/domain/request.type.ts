import { DateValueObject } from './date.value-object';

export enum RequestType {
  REWORK_REQUEST = 'rework_request',
  ABSENCE_REQUEST = 'bbsence_request',
  WORK_OVERTIME_REQUEST = 'work_overtime_request',
  SALARY_REQUEST = 'salary_and_benefits_request',
  BUSINESS_TRAVEL_REQUEST = 'business_travel_request',
  CHANGE_SHIFT_REQUEST = 'change_shift_request',
  EQUIPMENT_REQUEST = 'equipment_request',
  PAYMENT_REQUEST = 'payment_request',
  LEAVING_REQUEST = 'leaving_request',
}

export enum StatusType {
  CANCELED = 'Đã huỷ',
  NOT_APPROVED = 'Từ chối',
  APPROVED = 'Đồng ý',
  PENDING = 'Đang phê duyệt',
}

export enum StageType {
  APPROVAL_STAGE = 'Phê duyệt',
  IN_PROGRESS = 'Đang thực thi',
  END_STAGE = 'Kết thúc',
}

export type ApproverType = Required<{
  readonly userId: string;
  readonly order: number;
  readonly isDefault: boolean;
}>;

export type SelfPay = Required<{
  readonly typeName: 'Cá nhân tự chi trả';
}>;

export enum Shift {
  MORNING_SHIFT = 'Ca sáng',
  AFTERNOON_SHIFT = 'Ca chiều',
}

export type Sponsored = Required<{
  readonly typeName: 'Công ty tài trợ';
  readonly cost: number;
  readonly detailedCosts: string;
}>;

export type ReworkRequestType = Required<{
  readonly dateOff: DateValueObject;
  readonly reworkDate: DateValueObject;
}>;

export type AbsenceType = Required<{
  readonly name: string;
  readonly remainingDate: number;
  readonly year: number;
}>;

export type AbsenceRequestType = Required<{
  readonly type: AbsenceType;
  readonly dateStart: Date;
  readonly dateEnd: Date;
}>;

export type WorkOvertimeRequestType = Required<{
  readonly date: DateValueObject[];
}>;

export type SalaryAndBenefitsRequestType = Required<{
  readonly type: string;
}>;

export type BusinessTravelRequestType = Required<{
  readonly purpose: string;
  readonly dateStart: Date;
  readonly dateEnd: Date;
  readonly travelExpenses: SelfPay | Sponsored;
  readonly attachmentName: string;
  readonly attachmentURI: string;
}>;

export type ChangeShiftRequestType = Required<{
  readonly substituteId: string;
  readonly dateToChange: Date;
  readonly shiftToChange: Shift;
  readonly dateChangedTo: Date;
  readonly shiftChangedTo: Shift;
}>;

export type ProductType = Required<{
  readonly name: string;
  readonly unit: string;
  readonly quantity: number;
  readonly receivedDate: Date;
}>;

export type EquipmentRequestType = Required<{
  readonly equipmentType: string;
  readonly reason: string;
  readonly products: ProductType[];
}>;

export type PaymentRequestType = Required<{
  readonly type: string;
  readonly costs: number;
  readonly receivedDate: Date;
  readonly detail: string;
  readonly attachmentName: string;
  readonly attachmentURI: string;
}>;

export type LeavingRequestType = Required<{
  readonly date: Date;
  readonly handOverPlan: string;
}>;
