import { ExceptionBase } from 'src/libs/exception.base';

export class TodoNotFoundError extends ExceptionBase {
  public readonly code = 'TODO.NOT_FOUND';
  static readonly message = 'Todo not found';

  constructor(metadata?: unknown) {
    super(TodoNotFoundError.message, metadata);
  }
}

export class TodoAlreadyExistError extends ExceptionBase {
  public readonly code = 'TODO.ALREADY_EXIST';
  static readonly message = 'Todo already exist';

  constructor(metadata?: unknown) {
    super(TodoAlreadyExistError.message, metadata);
  }
}

export class InvalidTodoParentIdError extends ExceptionBase {
  public readonly code = 'TODO.INVALID_TODO_PARENT_ID';
  static readonly message = 'Invalid todo parent id';

  constructor(metadata?: unknown) {
    super(InvalidTodoParentIdError.message, metadata);
  }
}

export class TodoCannotMovedError extends ExceptionBase {
  public readonly code = 'TODO.CAN_NOT_MOVED';
  static readonly message = 'Todo cannot be moved';

  constructor(metadata?: unknown) {
    super(TodoCannotMovedError.message, metadata);
  }
}

export class TodoCannotCheckedError extends ExceptionBase {
  public readonly code = 'TODO.CAN_NOT_CHECKED';
  static readonly message = 'Todo cannot be checked';

  constructor(metadata?: unknown) {
    super(TodoCannotCheckedError.message, metadata);
  }
}
