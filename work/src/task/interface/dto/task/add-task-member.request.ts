import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AddTaskMemberRequest {
  @ApiProperty({ description: 'The memeber Id' })
  @IsUUID()
  readonly memberId: string;
}
