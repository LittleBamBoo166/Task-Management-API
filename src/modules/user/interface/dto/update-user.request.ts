import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserRequest {
  @ApiProperty({
    example: 'BroomBroom',
    description: 'Your user name',
    nullable: true,
  })
  @IsString()
  @MaxLength(100)
  @MinLength(5)
  readonly name?: string;

  @ApiProperty({
    description: 'Your password',
    nullable: true,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(30)
  readonly password?: string;
}
