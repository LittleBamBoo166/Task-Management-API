import { ExceptionBase } from 'src/libs/base-class/exception.base';

export class UserAlreadyExistError extends ExceptionBase {
  public readonly code = 'USER.ALREADY_EXISTS';
  static readonly message = 'User already exists';

  constructor(metadata?: unknown) {
    super(UserAlreadyExistError.message, metadata);
  }
}

export class UserNotFoundError extends ExceptionBase {
  public readonly code = 'USER.NOT_FOUND';
  static readonly message = 'User(s) not found';

  constructor(metadata?: unknown) {
    super(UserNotFoundError.message, metadata);
  }
}

export class IncorrectPasswordError extends ExceptionBase {
  public readonly code = 'USER.INCORRECT_PASSWORD';
  static readonly message = 'Incorrect password';

  constructor(metadata?: unknown) {
    super(IncorrectPasswordError.message, metadata);
  }
}

export class AccessDeniedError extends ExceptionBase {
  public readonly code = 'USER.ACCESS_DENIED';
  static readonly message = 'Access is denied';

  constructor(metadata?: unknown) {
    super(AccessDeniedError.message, metadata);
  }
}
