import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateTodoRequest {
  @ApiProperty({
    nullable: true,
    description: 'The todo title',
    example: 'Todo 2',
  })
  @IsNotEmpty()
  @IsString()
  name?: string;

  @ApiProperty({ nullable: true, description: 'The parent-todo ID' })
  @IsOptional()
  @IsUUID()
  parentTodoId?: string;

  @ApiProperty({
    nullable: true,
    description: 'The todo status',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  checked?: boolean;
}
