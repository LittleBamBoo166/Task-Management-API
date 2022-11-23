import { IsNotEmpty, IsString, IsUrl, IsUUID } from 'class-validator';
import { Checking } from 'src/libs/util/checking';

export type AttachmentProperties = Required<{
  readonly id: string;
  readonly storageUri: string;
  readonly fileName: string;
}>;

export type UpdateAttachmentProperties = Required<{
  readonly storageUri: string;
  readonly fileName: string;
}>;

export class AttachmentModel {
  @IsNotEmpty()
  @IsUUID()
  private id: string;

  @IsNotEmpty()
  @IsString()
  private fileName: string;

  @IsNotEmpty()
  @IsUrl()
  private storageUri: string;

  constructor(properties: AttachmentProperties) {
    Object.assign(this, properties);
  }

  public getProperties(): AttachmentProperties {
    return {
      id: this.id,
      fileName: this.fileName,
      storageUri: this.storageUri,
    };
  }

  public edit(data: UpdateAttachmentProperties): void {
    if (
      !Checking.isEmpty(data.fileName) &&
      !Checking.isEmpty(data.storageUri)
    ) {
      this.storageUri = data.storageUri;
      this.fileName = data.fileName;
    }
  }
}
