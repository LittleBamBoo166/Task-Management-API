import { ExceptionBase } from 'src/libs/exception.base';

export class BoardAlreadyExistError extends ExceptionBase {
  public readonly code = 'BOARD.ALREADY_EXISTS';
  static readonly message = 'Board already exists';

  constructor(metadata?: unknown) {
    super(BoardAlreadyExistError.message, metadata);
  }
}

export class BoardNotFoundError extends ExceptionBase {
  public readonly code = 'BOARD.NOT_FOUND';
  static readonly message = 'Board not found';

  constructor(metadata?: unknown) {
    super(BoardNotFoundError.message, metadata);
  }
}

export class BoardCannotAccessedError extends ExceptionBase {
  public readonly code = 'BOARD.CAN_NOT_ACCESSED';
  static readonly message = 'Board can not accessed';

  constructor(metadata?: unknown) {
    super(BoardNotFoundError.message, metadata);
  }
}

export class DeleteDependentTablesFailError extends ExceptionBase {
  public readonly code = 'BOARD.DELETE_DEPENDENT_TABLES_FAIL';
  static readonly message = 'Deleting dependent tables failed';

  constructor(metadata?: unknown) {
    super(DeleteDependentTablesFailError.message, metadata);
  }
}
