import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class RemoveTaskLabelRequest {
  @ApiProperty({ description: 'The label ID' })
  @IsNotEmpty()
  @IsUUID()
  labelId: string;
}
