import { IsNotEmpty, IsUUID } from 'class-validator';

export type MemberEssentialProperties = Required<{
  readonly id: string;
  readonly userId: string;
}>;

export type MemberProperties = MemberEssentialProperties;

export class MemberModel {
  @IsNotEmpty()
  @IsUUID()
  private id: string;

  @IsNotEmpty()
  @IsUUID()
  private userId: string;

  constructor(properties: MemberEssentialProperties) {
    Object.assign(this, properties);
  }

  public getProperties(): MemberProperties {
    return {
      id: this.id,
      userId: this.userId,
    };
  }
}
