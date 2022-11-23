import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCommentRequest {
  @ApiProperty({
    nullable: false,
    description: "The comment's content",
    example: 'This is a great task',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  content: string;
}
