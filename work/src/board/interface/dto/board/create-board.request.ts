import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateBoardRequest {
  @ApiProperty({
    nullable: false,
    description: 'The board name',
    example: 'Board 1',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  readonly boardName: string;

  @ApiProperty({
    nullable: true,
    description: 'The board description',
    example: 'Board description',
  })
  @IsString()
  @MinLength(10)
  readonly description?: string;
}
