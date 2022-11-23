// import {
//   IsEmail,
//   IsNotEmpty,
//   IsString,
//   MaxLength,
//   MinLength,
// } from 'class-validator';

// export class CreateUserRequest {
//   @IsNotEmpty()
//   @IsString()
//   @MaxLength(100)
//   @MinLength(5)
//   readonly name: string;

//   @IsNotEmpty()
//   @IsEmail()
//   @MinLength(5)
//   readonly email: string;

//   @IsNotEmpty()
//   @IsString()
//   @MinLength(8)
//   @MaxLength(30)
//   readonly password: string;
// }
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserRequest {
  @ApiProperty({
    example: 'user101',
    description: 'User name',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @MinLength(5)
  readonly name: string;

  @ApiProperty({
    example: 'user101@gmail.com',
    description: 'User email address',
  })
  @IsNotEmpty()
  @IsEmail()
  @MinLength(5)
  readonly email: string;

  @ApiProperty({
    example: 'acbd1234',
    description: 'User password',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(30)
  readonly password: string;
}
