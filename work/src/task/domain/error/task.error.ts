import { ExceptionBase } from 'src/libs/exception.base';

export class TaskNotFoundError extends ExceptionBase {
  public readonly code = 'TASK.NOT_FOUND';
  static readonly message = 'Task not found';

  constructor(metadata?: unknown) {
    super(TaskNotFoundError.message, metadata);
  }
}

export class InvalidMemberError extends ExceptionBase {
  public readonly code = 'TASK.INVALID_MEMBER';
  static readonly message = 'The member is not valid';

  constructor(metadata?: unknown) {
    super(InvalidMemberError.message, metadata);
  }
}

export class TaskMemberNotFound extends ExceptionBase {
  public readonly code = 'TASK.MEMBER_NOT_FOUND';
  static readonly message = 'The member not found';

  constructor(metadata?: unknown) {
    super(TaskMemberNotFound.message, metadata);
  }
}

export class InvalidLabelError extends ExceptionBase {
  public readonly code = 'TASK.INVALID_LABEL';
  static readonly message = 'The label is not valid';

  constructor(metadata?: unknown) {
    super(InvalidLabelError.message, metadata);
  }
}

export class LabelAlreadyExistError extends ExceptionBase {
  public readonly code = 'TASK.LABEL_ALREADY_EXIST';
  static readonly message = 'The label already exist';

  constructor(metadata?: unknown) {
    super(LabelAlreadyExistError.message, metadata);
  }
}

export class LabelNotFoundError extends ExceptionBase {
  public readonly code = 'TASK.LABEL_NOT_FOUND';
  static readonly message = 'The label already exist';

  constructor(metadata?: unknown) {
    super(LabelNotFoundError.message, metadata);
  }
}

export class CannotCreateTaskError extends ExceptionBase {
  public readonly code = 'TASK.CAN_NOT_CREATE';
  static readonly message = 'Cannot create task';

  constructor(metadata?: unknown) {
    super(CannotCreateTaskError.message, metadata);
  }
}

export class TaskCanNotAccessedError extends ExceptionBase {
  public readonly code = 'TASK.CAN_NOT_ACCESSED';
  static readonly message = 'Task cannot accessed';

  constructor(metadata?: unknown) {
    super(TaskCanNotAccessedError.message, metadata);
  }
}

export class InvalidDueDateError extends ExceptionBase {
  public readonly code = 'TASK.INVALID_DUE_DATE';
  static readonly message = 'Invalid due date';

  constructor(metadata?: unknown) {
    super(InvalidDueDateError.message, metadata);
  }
}

export class CannotMoveTaskError extends ExceptionBase {
  public readonly code = 'TASK.CAN_NOT_MOVE';
  static readonly message = 'Cannot move task to this list';

  constructor(metadata?: unknown) {
    super(CannotMoveTaskError.message, metadata);
  }
}
