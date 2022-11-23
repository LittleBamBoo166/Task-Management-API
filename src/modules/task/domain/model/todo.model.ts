import { AggregateRoot } from '@nestjs/cqrs';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Checking } from 'src/libs/util/checking';

export type TodoEssentialProperties = Required<{
  readonly id: string;
  readonly name: string;
  readonly taskId: string;
}>;

export type TodoOptionalProperties = Partial<{
  readonly parentTodoId: string;
  readonly checked: boolean;
}>;

export type UpdateTodoProperties = Partial<{
  readonly name: string;
  readonly parentTodoId: string;
  readonly checked: boolean;
}>;

export type TodoProperties = TodoEssentialProperties &
  Required<TodoOptionalProperties>;

export class TodoModel extends AggregateRoot {
  @IsNotEmpty()
  @IsUUID()
  public readonly id: string;

  @IsNotEmpty()
  @IsString()
  private name: string;

  @IsNotEmpty()
  @IsUUID()
  private taskId: string;

  @IsNotEmpty()
  @IsBoolean()
  private checked: boolean;

  @IsOptional()
  @IsUUID()
  private parentTodoId: string;

  constructor(properties: TodoEssentialProperties & TodoOptionalProperties) {
    super();
    Object.assign(this, properties);
  }

  public getProperties(): TodoProperties {
    return {
      id: this.id,
      name: this.name,
      taskId: this.taskId,
      checked: this.checked,
      parentTodoId: this.parentTodoId,
    };
  }

  public edit(data: UpdateTodoProperties): void {
    if (!Checking.isEmpty(data.checked)) {
      this.checked = data.checked;
    }
    if (!Checking.isEmpty(data.parentTodoId)) {
      this.parentTodoId = data.parentTodoId;
    }
    if (!Checking.isEmpty(data.name)) {
      this.name = data.name;
    }
  }

  public move(parentTodoId: string): boolean {
    if (!this.parentTodoId || this.parentTodoId.length === 0) {
      return false;
    }
    this.parentTodoId = parentTodoId;
    return true;
  }

  public checking(): boolean {
    if (!this.parentTodoId || this.parentTodoId.length === 0) {
      return false;
    }
    if (this.checked === true) {
      this.checked = false;
    } else {
      this.checked = true;
    }
    return true;
  }
}
