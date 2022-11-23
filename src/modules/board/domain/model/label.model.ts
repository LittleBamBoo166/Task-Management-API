import {
  IsHexColor,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Checking } from 'src/libs/util/checking';

export type LabelEssentialProperties = Required<{
  readonly id: string;
  readonly name: string;
}>;

export type LabelOptionalProperties = Partial<{
  readonly color: string;
}>;

export type UpdateLabelProperties = Partial<{
  readonly name: string;
  readonly color: string;
}>;

export type LabelPropertiees = LabelEssentialProperties &
  Required<LabelOptionalProperties>;

export class LabelModel {
  @IsNotEmpty()
  @IsUUID()
  private id: string;

  @IsNotEmpty()
  @IsString()
  private name: string;

  @IsOptional()
  @IsHexColor()
  private color?: string;

  constructor(properties: LabelEssentialProperties & LabelOptionalProperties) {
    Object.assign(this, properties);
  }

  public getProperties(): LabelPropertiees {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
    };
  }

  public edit(data: UpdateLabelProperties): void {
    if (!Checking.isEmpty(data.name)) {
      this.name = data.name;
    }
    if (!Checking.isEmpty(data.color) && Checking.isHexColor(data.color)) {
      this.color = data.color;
    }
  }
}
