import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCommentRequest {
  @ApiProperty({
    nullable: false,
    description: 'New content',
    example:
      'I love working. Working makes me happy. Working makes my life bright.',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
