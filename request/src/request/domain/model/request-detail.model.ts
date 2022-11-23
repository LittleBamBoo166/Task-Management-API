import {
  ReworkRequestType,
  AbsenceRequestType,
  WorkOvertimeRequestType,
  SalaryAndBenefitsRequestType,
  BusinessTravelRequestType,
  ChangeShiftRequestType,
  EquipmentRequestType,
  LeavingRequestType,
  PaymentRequestType,
  RequestType,
} from '../request.type';

export type RequestDetailType =
  | EquipmentRequestType
  | AbsenceRequestType
  | WorkOvertimeRequestType
  | SalaryAndBenefitsRequestType
  | BusinessTravelRequestType
  | ChangeShiftRequestType
  | ReworkRequestType
  | PaymentRequestType
  | LeavingRequestType;

export type RequestDetailProperites = Required<{
  readonly requestId: string;
  readonly detail: RequestDetailType;
  readonly type: RequestType;
}>;
