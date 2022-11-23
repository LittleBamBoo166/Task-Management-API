import { AttachmentProperties } from '../../domain/model/attachment.model';
import { CommentProperties } from '../../domain/model/comment.model';
import { TaskProperties } from '../../domain/model/task.model';
import { TodoProperties } from '../../domain/model/todo.model';

export class TaskResponseWithDetail {
  readonly id: string;
  readonly name: string;
  readonly listId: string;
  readonly dueDate?: string;
  readonly order?: number;
  readonly priority?: number;
  readonly comments: CommentProperties[];
  readonly attachments: AttachmentProperties[];
  readonly members: string[];
  readonly label?: string[];
  readonly todos: TodoProperties[];

  constructor(data: TaskProperties) {
    this.id = data.id;
    this.name = data.name;
    this.listId = data.listId;
    this.dueDate = data.dueDate;
    this.order = data.order;
    this.priority = data.priority;
    this.attachments = data.attachments
      ? data.attachments.map((attachment) => attachment.getProperties())
      : null;
    this.members = data.members ? data.members : null;
    this.comments = data.comments
      ? data.comments.map((comment) => comment.getProperties())
      : null;
    this.label = data.labels ? data.labels : null;
    this.todos = data.todos
      ? data.todos.map((todo) => todo.getProperties())
      : null;
  }
}
