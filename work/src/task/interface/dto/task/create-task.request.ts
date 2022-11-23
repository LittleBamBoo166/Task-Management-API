import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
  IsNumber,
  IsUUID,
} from 'class-validator';

export class CreateTaskRequest {
  @ApiProperty({
    nullable: false,
    example: 'Task 1',
    description: 'The task name',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    nullable: true,
    description: 'Due date',
    example: '2022-12-25T12:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({
    nullable: true,
    description: 'Priority of the task',
    example: '1',
  })
  @IsOptional()
  @IsNumber()
  priority?: number;

  @ApiProperty({
    nullable: true,
    description: 'Task order in the UI',
    example: '2',
  })
  @IsOptional()
  @IsNumber()
  order?: number;

  @ApiProperty({
    nullable: false,
    description: 'The id of the list that this task belongs to',
  })
  @IsNotEmpty()
  @IsUUID()
  listId: string;
}
