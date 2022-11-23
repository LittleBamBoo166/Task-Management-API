import {
  IsHexColor,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Checking } from 'src/libs/util/checking';

export type ListEssentialProperties = Required<{
  readonly id: string;
  readonly name: string;
}>;

export type ListOptionalProperties = Partial<{
  readonly color: string;
  readonly order: number;
}>;

export type UpdateListProperties = Partial<{
  readonly name: string;
  readonly color: string;
  readonly order: number;
}>;

export type ListProperties = ListEssentialProperties &
  Required<ListOptionalProperties>;

export class ListModel {
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  private id: string;

  @IsNotEmpty()
  @IsString()
  private name: string;

  @IsOptional()
  @IsHexColor()
  private color?: string;

  @IsOptional()
  @IsNumber()
  private order?: number;

  constructor(properties: ListEssentialProperties & ListOptionalProperties) {
    Object.assign(this, properties);
  }

  public getProperties(): ListProperties {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      order: this.order,
    };
  }

  public edit(data: UpdateListProperties): void {
    if (!Checking.isEmpty(data.name)) {
      this.name = data.name;
    }
    if (!Checking.isEmpty(data.color) && Checking.isHexColor(data.color)) {
      this.color = data.color;
    }
    if (!Checking.isEmpty(data.order)) {
      this.order = data.order;
    }
  }
}
