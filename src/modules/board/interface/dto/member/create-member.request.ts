import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateMemberRequest {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty()
  readonly id: string;
}
