import { AggregateRoot } from '@nestjs/cqrs';
import {
  IsDateString,
  IsInstance,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Checking } from 'src/libs/checking';
import { AttachmentModel } from './attachment.model';
import { CommentModel } from './comment.model';
import { TodoModel } from './todo.model';

export type TaskEssentialProperties = Required<{
  readonly id: string;
  readonly name: string;
  readonly listId: string;
}>;

export type TaskOptionalProperties = Partial<{
  readonly dueDate: string;
  readonly priority: number;
  readonly order: number;
  readonly boardId: string;
  readonly members: string[];
  readonly currentActive: string;
  readonly labels: string[];
}>;

export type UpdateTaskProperties = Partial<{
  readonly name: string;
  readonly priority: number;
  readonly order: number;
}>;

export type TaskDependentModels = Partial<{
  readonly attachments: AttachmentModel[];
  readonly comments: CommentModel[];
  readonly todos: TodoModel[];
}>;

export type TaskProperties = TaskEssentialProperties &
  Required<TaskOptionalProperties> &
  TaskDependentModels;

export class TaskModel extends AggregateRoot {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  public readonly id: string;

  @IsNotEmpty()
  @IsString()
  private name: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  private listId: string;

  @IsDateString()
  private dueDate: string;

  @IsNotEmpty()
  @IsNumber()
  private priority: number;

  @IsNotEmpty()
  @IsNumber()
  private order: number;

  @IsOptional()
  @IsInstance(AttachmentModel)
  private attachments?: AttachmentModel[];

  @IsOptional()
  @IsInstance(CommentModel)
  private comments?: CommentModel[];

  @IsOptional()
  @IsUUID()
  private boardId?: string;

  @IsOptional()
  @IsString()
  private currentActive?: string;

  @IsOptional()
  @IsString()
  private members?: string[];

  @IsOptional()
  @IsString()
  private labels?: string[];

  @IsOptional()
  @IsInstance(TodoModel)
  private todos?: TodoModel[];

  constructor(properties: TaskEssentialProperties & TaskOptionalProperties) {
    super();
    Object.assign(this, properties);
    if (!Checking.isEmpty(properties.dueDate)) {
      if (!this.isValidDueDate(properties.dueDate)) {
        this.dueDate = undefined;
      }
    }
  }

  public getProperties(): TaskProperties {
    return {
      id: this.id,
      name: this.name,
      listId: this.listId,
      dueDate: this.dueDate,
      order: this.order,
      priority: this.priority,
      attachments: this.attachments,
      comments: this.comments,
      labels: this.labels,
      boardId: this.boardId,
      currentActive: this.currentActive,
      members: this.members,
      todos: this.todos,
    };
  }

  public edit(data: UpdateTaskProperties): void {
    if (!Checking.isEmpty(data.name)) {
      this.name = data.name;
    }
    if (!Checking.isEmpty(data.order)) {
      this.order = data.order;
    }
    if (!Checking.isEmpty(data.priority)) {
      this.priority = data.priority;
    }
  }

  public addMember(memberId: string): boolean {
    if (!Array.isArray(this.members) || !this.members) {
      this.members = [];
    }
    if (!this.members.includes(memberId)) {
      this.members.push(memberId);
      return true;
    }
    return false;
  }

  public addLabel(labelId: string): boolean {
    if (!Array.isArray(this.labels) || !this.labels) {
      this.labels = [];
    }
    if (!this.labels.includes(labelId)) {
      this.labels.push(labelId);
      return true;
    }
    return false;
  }

  public removeLabel(labelId: string): boolean {
    if (!Array.isArray(this.labels) || !this.labels) return false;
    const index = this.labels.indexOf(labelId);
    if (index === -1) return false;
    else {
      this.labels.splice(index, 1);
      return true;
    }
  }

  public removeMember(memberId: string): boolean {
    if (!Array.isArray(this.members) || !this.members) return false;
    const index = this.members.indexOf(memberId);
    if (index === -1) return false;
    else {
      this.members.splice(index, 1);
      return true;
    }
  }

  public assignToMember(memberId: string): boolean {
    if (this.members.includes(memberId)) {
      this.currentActive = memberId;
      return true;
    }
    return false;
  }

  public setDueDate(dueDateTimestamp: string): boolean {
    if (!this.isValidDueDate(dueDateTimestamp)) {
      return false;
    } else {
      this.dueDate = dueDateTimestamp;
      return true;
    }
  }

  public move(listId: string, order: number): void {
    if (!Checking.isEmpty(listId)) this.listId = listId;
    if (!Checking.isEmpty(order)) this.order = order;
  }

  private isValidDueDate(dueDateTimestamp: string): boolean {
    const dueDate = new Date(dueDateTimestamp);
    if (isNaN(dueDate.valueOf())) {
      return false;
    }
    if (dueDate.getTime() <= new Date().getTime()) {
      return false;
    }
    return true;
  }
}
