import { ExceptionBase } from 'src/libs/base-class/exception.base';

export class MemberAlreadyExistError extends ExceptionBase {
  public readonly code = 'MEMBER.ALREADY_EXISTS';
  static readonly message = 'Member already exists';

  constructor(metadata?: unknown) {
    super(MemberAlreadyExistError.message, metadata);
  }
}

export class MemberDoesNotExistError extends ExceptionBase {
  public readonly code = 'MEMBER.NOT_FOUND';
  static readonly message = 'Member does not exist';

  constructor(metadata?: unknown) {
    super(MemberDoesNotExistError.message, metadata);
  }
}
