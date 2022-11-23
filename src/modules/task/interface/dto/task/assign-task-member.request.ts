import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AssignTaskMemberRequest {
  @ApiProperty()
  @IsUUID()
  readonly memberId: string;
}
