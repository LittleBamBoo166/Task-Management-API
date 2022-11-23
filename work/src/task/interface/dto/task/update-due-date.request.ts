import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class UpdateDueDateRequest {
  @ApiProperty({
    nullable: false,
    description: 'New due date',
    example: '2023-03-25T12:00:00Z',
  })
  @IsNotEmpty()
  @IsDateString()
  readonly dueDate: string;
}
