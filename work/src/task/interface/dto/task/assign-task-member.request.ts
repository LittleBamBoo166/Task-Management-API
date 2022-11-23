import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AssignTaskMemberRequest {
  @ApiProperty({ description: 'The member ID' })
  @IsUUID()
  readonly memberId: string;
}
