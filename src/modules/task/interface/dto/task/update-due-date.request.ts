import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class UpdateDueDateRequest {
  @ApiProperty({ nullable: false, description: 'New due date' })
  @IsNotEmpty()
  @IsDateString()
  readonly dueDate: string;
}
