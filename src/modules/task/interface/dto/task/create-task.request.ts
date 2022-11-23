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
    example: 'Task name',
    description: 'Short description',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ nullable: true, description: 'Due date' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({ nullable: true, description: 'Priority of the task' })
  @IsOptional()
  @IsNumber()
  priority?: number;

  @ApiProperty({ nullable: true, description: 'Task order in the UI' })
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
