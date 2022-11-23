import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class AddTaskLabelRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  labelId: string;
}
