// import { IsString, MaxLength, MinLength } from 'class-validator';

// export class UpdateUserRequest {
//   @IsString()
//   @MaxLength(100)
//   @MinLength(5)
//   readonly name?: string;

//   @IsString()
//   @MinLength(8)
//   @MaxLength(30)
//   readonly password?: string;
// }
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserRequest {
  @ApiProperty({
    example: 'user101',
    description: 'Your user name',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @MinLength(5)
  readonly name?: string;

  @ApiProperty({
    example: 'acbd1234',
    description: 'Your password',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(30)
  readonly password?: string;
}
