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
    example: 'jokemif176@dnitem.com',
    description: 'Your email',
  })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  readonly email: string;

  @ApiProperty({
    example: 'acbd1234',
    description: 'Your password',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(30)
  readonly password: string;
}
