import { ExceptionBase } from '../base-class/exception.base';
import { ExceptionCodes } from './exception.codes';

export class ConflictException extends ExceptionBase {
  readonly code: ExceptionCodes.conflict;
}
