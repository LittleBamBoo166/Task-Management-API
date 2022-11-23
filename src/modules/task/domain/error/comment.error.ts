import { ExceptionBase } from 'src/libs/base-class/exception.base';
import { TaskNotFoundError } from './task.error';

export class CommentNotFoundError extends ExceptionBase {
  public readonly code = 'COMMENT.NOT_FOUND';
  static readonly message = 'Comment not found';

  constructor(metadata?: unknown) {
    super(TaskNotFoundError.message, metadata);
  }
}

export class CommentCannotEdited extends ExceptionBase {
  public readonly code = 'COMMENT.CAN_NOT_EDITED';
  static readonly message =
    'Comment cannot be edited. You may be not the owner of this comment';

  constructor(metadata?: unknown) {
    super(TaskNotFoundError.message, metadata);
  }
}
