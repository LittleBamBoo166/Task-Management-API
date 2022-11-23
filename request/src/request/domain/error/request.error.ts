import { ExceptionBase } from './exception.base';

export class InvalidValueError extends ExceptionBase {
  public readonly code = 'INVALID_VALUE';
  static readonly message = 'Inalid value';

  constructor(metadata?: unknown) {
    super(InvalidValueError.message, metadata);
  }
}
