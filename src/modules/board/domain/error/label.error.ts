import { ExceptionBase } from 'src/libs/base-class/exception.base';

export class LabelAlreadyExistError extends ExceptionBase {
  public readonly code = 'LABEL.ALREADY_EXISTS';
  static readonly message = 'Label already exists';

  constructor(metadata?: unknown) {
    super(LabelAlreadyExistError.message, metadata);
  }
}

export class LabelNotFoundError extends ExceptionBase {
  public readonly code = 'LABEL.NOT_FOUND';
  static readonly message = 'Label not found';

  constructor(metadata?: unknown) {
    super(LabelNotFoundError.message, metadata);
  }
}
