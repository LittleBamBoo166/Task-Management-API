import { ExceptionBase } from '../base-class/exception.base';
import { ExceptionCodes } from './exception.codes';

export class ArgumentNotProvideException extends ExceptionBase {
  readonly code: ExceptionCodes.argumentNotProvided;
  static readonly message = 'Argument is not provided';

  constructor(metadata?: unknown) {
    super(ArgumentNotProvideException.message, metadata);
  }
}
