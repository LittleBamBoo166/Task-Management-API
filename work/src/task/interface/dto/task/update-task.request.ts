import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateTaskRequest {
  @ApiProperty({
    nullable: true,
    example: 'Task 1',
    description: 'Short description',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    nullable: true,
    description: 'Priority of the task',
    example: '2',
  })
  @IsOptional()
  @IsNumber()
  priority?: number;
}
