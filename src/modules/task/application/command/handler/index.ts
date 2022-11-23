import { AddTaskMemberHandler } from './task/add-task-member.handler';
import { AssignTaskMemberHandler } from './task/assign-task-member.handler';
import { CreateAttachmentHandler } from './attachment/create-attachment.handler';
import { CreateCommentHandler } from './comment/create-comment.handler';
import { CreateTaskHandler } from './task/create-task.handler';
import { CreateTodoHandler } from './todo/create-todo.handler';
import { DeleteAttachmentHandler } from './attachment/delete-attachment.handler';
import { DeleteCommentHandler } from './comment/delete-comment.handler';
import { DeleteTaskHandler } from './task/delete-task.handler';
import { DeleteTodoHandler } from './todo/delete-todo.handler';
import { UpdateAttachmentHandler } from './attachment/update-attachment.handler';
import { UpdateCommentHandler } from './comment/update-comment.handler';
import { UpdateTaskHandler } from './task/update-task.handler';
import { UpdateTodoHandler } from './todo/update-todo.handler';
import { AddTaskLabelHandler } from './task/add-task-label.handler';
import { MoveTaskHandler } from './task/move-task.handler';
import { RemoveTaskMemberHandler } from './task/remove-task-member.handler';
import { RemoveTaskLabelHandler } from './task/remove-task-label.handler';
import { UpdateDueDateHandler } from './task/update-due-date.handler';

export const commandHandler = [
  CreateTaskHandler,
  UpdateTaskHandler,
  DeleteTaskHandler,
  MoveTaskHandler,
  UpdateDueDateHandler,
  CreateAttachmentHandler,
  UpdateAttachmentHandler,
  DeleteAttachmentHandler,
  CreateCommentHandler,
  UpdateCommentHandler,
  DeleteCommentHandler,
  AddTaskMemberHandler,
  AssignTaskMemberHandler,
  RemoveTaskMemberHandler,
  CreateTodoHandler,
  UpdateTodoHandler,
  DeleteTodoHandler,
  AddTaskLabelHandler,
  RemoveTaskLabelHandler,
];
