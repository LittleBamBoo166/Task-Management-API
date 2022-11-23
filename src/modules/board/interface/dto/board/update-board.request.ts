import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateBoardRequest {
  @ApiProperty({ description: 'The board name' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  readonly name?: string;

  @ApiProperty({ description: 'Short description' })
  @IsOptional()
  @IsString()
  @MinLength(10)
  readonly description?: string;
}
