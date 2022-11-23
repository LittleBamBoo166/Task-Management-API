import { ExceptionBase } from 'src/libs/exception.base';

export class ListAlreadyExistError extends ExceptionBase {
  public readonly code = 'LIST.ALREADY_EXISTS';
  static readonly message = 'List already exists';

  constructor(metadata?: unknown) {
    super(ListAlreadyExistError.message, metadata);
  }
}

export class ListNotFoundError extends ExceptionBase {
  public readonly code = 'LIST.NOT_FOUND';
  static readonly message = 'List not found';

  constructor(metadata?: unknown) {
    super(ListNotFoundError.message, metadata);
  }
}
