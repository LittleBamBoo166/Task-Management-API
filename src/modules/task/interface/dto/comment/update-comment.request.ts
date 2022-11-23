import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCommentRequest {
  @ApiProperty({ nullable: false, description: 'New content' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
