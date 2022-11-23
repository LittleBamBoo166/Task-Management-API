import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Checking } from 'src/libs/checking';

export type CommentProperties = Required<{
  readonly id: string;
  readonly content: string;
  readonly memberId: string;
}>;

export type UpdateCommentProperties = Required<{
  readonly content: string;
}>;
export class CommentModel {
  @IsNotEmpty()
  @IsUUID()
  private id: string;

  @IsNotEmpty()
  @IsUUID()
  private memberId: string;

  @IsNotEmpty()
  @IsString()
  private content: string;

  constructor(properties: CommentProperties) {
    Object.assign(this, properties);
  }

  public getProperties(): CommentProperties {
    return {
      id: this.id,
      content: this.content,
      memberId: this.memberId,
    };
  }

  public edit(data: UpdateCommentProperties) {
    if (!Checking.isEmpty(data)) {
      this.content = data.content;
    }
  }
}
