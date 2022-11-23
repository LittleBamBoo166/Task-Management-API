import { IsNotEmpty } from 'class-validator';
import { IsArray, IsDate, IsEnum, IsString, IsUUID } from 'class-validator';
import {
  ApproverType,
  RequestType,
  StageType,
  StatusType,
} from '../request.type';

export type RequestEssentialProperties = Required<{
  readonly id: string;
  readonly type: RequestType;
  readonly message: string;
  readonly status: StatusType;
  readonly stage: StageType;
  readonly requesterId: string;
  readonly ccTo: string[];
  readonly approver: ApproverType[];
}>;

export type RequestOptionalProperties = Partial<{
  readonly createDate: Date;
  readonly updateDate: Date;
}>;

export type RequestProperties = RequestEssentialProperties &
  RequestOptionalProperties;

export type CreateRequestProperties = Required<{
  readonly type: RequestType;
  readonly message: string;
  readonly status: StatusType;
  readonly stage: StageType;
  readonly requesterId: string;
  readonly ccTo: string[];
  readonly approver: ApproverType[];
}>;

export class RequestModel {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  public readonly id: string;

  @IsNotEmpty()
  @IsEnum(RequestType)
  private type: RequestType;

  @IsNotEmpty()
  @IsDate()
  private createDate: Date;

  @IsNotEmpty()
  @IsDate()
  private updateDate: Date;

  @IsNotEmpty()
  @IsString()
  private message: string;

  @IsNotEmpty()
  @IsEnum(StatusType)
  private status: StatusType;

  @IsNotEmpty()
  @IsEnum(StageType)
  private stage: StageType;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  private requesterId: string;

  @IsNotEmpty()
  @IsArray()
  private ccTo: string[];

  @IsNotEmpty()
  @IsArray()
  private approver: ApproverType[];

  constructor(properties: RequestEssentialProperties) {
    Object.assign(this, properties);
  }

  public getProperties(): RequestProperties {
    return {
      id: this.id,
      type: this.type,
      createDate: this.createDate,
      updateDate: this.updateDate,
      message: this.message,
      status: this.status,
      stage: this.stage,
      requesterId: this.requesterId,
      ccTo: this.ccTo,
      approver: this.approver,
    };
  }
}
