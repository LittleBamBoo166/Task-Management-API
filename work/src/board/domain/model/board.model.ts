import { AggregateRoot } from '@nestjs/cqrs';
import {
  IsInstance,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Checking } from 'src/libs/checking';
import { UserCreatedBoardEvent } from '../event/user-created-board.event';
import { LabelModel } from './label.model';
import { ListModel } from './list.model';
import { MemberModel } from './member.model';

export type BoardEssentialProperties = Required<{
  readonly id: string;
  readonly name: string;
  readonly ownerId: string;
}>;

export type BoardOptionalProperties = Partial<{
  readonly description: string;
}>;

export type BoardDependentModels = Partial<{
  readonly lists: ListModel[];
  readonly members: MemberModel[];
  readonly labels: LabelModel[];
}>;

export type UpdateBoardProperties = Partial<{
  readonly name: string;
  readonly description: string;
}>;

export type BoardProperties = BoardEssentialProperties &
  Required<BoardOptionalProperties> &
  BoardDependentModels;

export class BoardModel extends AggregateRoot {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  public id: string;

  @IsString()
  @IsNotEmpty()
  private name: string;

  @IsUUID()
  @IsString()
  @IsNotEmpty()
  private ownerId: string;

  @IsOptional()
  @IsString()
  private description?: string;

  @IsOptional()
  @IsInstance(ListModel)
  private lists?: ListModel[];

  @IsOptional()
  @IsInstance(LabelModel)
  private labels?: LabelModel[];

  @IsOptional()
  @IsInstance(MemberModel)
  private members?: MemberModel[];

  constructor(properties: BoardEssentialProperties & BoardOptionalProperties) {
    super();
    Object.assign(this, properties);
    this.apply(new UserCreatedBoardEvent(properties.id, properties.ownerId));
  }

  public getProperties(): BoardProperties {
    return {
      id: this.id,
      name: this.name,
      ownerId: this.ownerId,
      description: this.description,
      lists: this.lists,
      members: this.members,
      labels: this.labels,
    };
  }

  public edit(data: UpdateBoardProperties): void {
    if (!Checking.isEmpty(data.name)) {
      this.name = data.name;
    }
    if (!Checking.isEmpty(data.description)) {
      this.description = data.description;
    }
  }
}
