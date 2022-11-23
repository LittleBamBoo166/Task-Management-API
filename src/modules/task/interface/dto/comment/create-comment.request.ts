import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCommentRequest {
  @ApiProperty({ nullable: false, description: "The comment's content" })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  content: string;
}
