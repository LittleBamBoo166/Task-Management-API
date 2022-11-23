import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginRequest {
  @ApiProperty({
    example: 'taylorswift@gmail.com',
    description: 'Your email',
  })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  readonly email: string;

  @ApiProperty({
    description: 'Your password',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(30)
  readonly password: string;
}
