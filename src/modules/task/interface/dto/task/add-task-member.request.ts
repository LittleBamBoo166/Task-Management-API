import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AddTaskMemberRequest {
  @ApiProperty()
  @IsUUID()
  readonly memberId: string;
}
