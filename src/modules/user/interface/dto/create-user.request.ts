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
    example: 'BroomBroom123',
    description: 'User name',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @MinLength(5)
  readonly name: string;

  @ApiProperty({
    example: 'broombroom123@gmail.com',
    description: 'User email address',
  })
  @IsNotEmpty()
  @IsEmail()
  @MinLength(5)
  readonly email: string;

  @ApiProperty({
    description: 'User password',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(30)
  readonly password: string;
}
