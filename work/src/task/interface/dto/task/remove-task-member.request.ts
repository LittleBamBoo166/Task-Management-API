import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class RemoveTaskMemberRequest {
  @ApiProperty({ description: 'The member ID' })
  @IsNotEmpty()
  @IsUUID()
  memberId: string;
}
