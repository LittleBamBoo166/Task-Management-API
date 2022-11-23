import { ExceptionBase } from 'src/libs/base-class/exception.base';

export class AttachmentNotFoundError extends ExceptionBase {
  public readonly code = 'ATTACHMENT.NOT_FOUND';
  static readonly message = 'Attachment not found';

  constructor(metadata?: unknown) {
    super(AttachmentNotFoundError.message, metadata);
  }
}

export class AttachmentAlreadyExistError extends ExceptionBase {
  public readonly code = 'ATTACHMENT.ALREADY_EXIST';
  static readonly message = 'Attachment already exist';

  constructor(metadata?: unknown) {
    super(AttachmentAlreadyExistError.message, metadata);
  }
}
