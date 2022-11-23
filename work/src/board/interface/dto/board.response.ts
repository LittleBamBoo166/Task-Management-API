import { LabelPropertiees } from '../../domain/model/label.model';
import { ListProperties } from '../../domain/model/list.model';
import { MemberProperties } from '../../domain/model/member.model';

export class BoardResponse {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly ownerId: string;
  readonly lists?: ListProperties[];
  readonly labels?: LabelPropertiees[];
  readonly members?: MemberProperties[];

  constructor(
    id: string,
    name: string,
    description?: string,
    ownerId?: string,
    list?: ListProperties[],
    members?: MemberProperties[],
    labels?: LabelPropertiees[],
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.ownerId = ownerId;
    this.lists = list;
    this.labels = labels;
    this.members = members;
  }
}
