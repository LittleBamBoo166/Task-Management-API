import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class MoveTaskRequest {
  @ApiProperty({
    nullable: false,
    description: 'Id of the list that the task move to',
  })
  @IsNotEmpty()
  @IsUUID()
  readonly listId: string;

  @ApiProperty({ nullable: false, description: 'The new order', example: '3' })
  @IsNotEmpty()
  @IsNumber()
  readonly order: number;
}
