import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTodoRequest {
  @ApiProperty({ nullable: true, description: 'The parent-todo ID' })
  @IsOptional()
  @IsString()
  parentTodoId?: string;

  @ApiProperty({
    nullable: false,
    description: 'The todo title',
    example: 'Todo 1',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
