import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateReworkRequestRequest {
  @ApiProperty({
    example: 'Mau do da vang toi la nguoi Viet Nam',
    description: 'Message',
  })
  @IsNotEmpty()
  @IsString()
  readonly message: string;

  @ApiProperty({
    description: 'Id of the approver',
  })
  @IsNotEmpty()
  @IsUUID()
  readonly approverId: string;

  @ApiProperty({
    description: 'Id of the users informed',
  })
  @IsNotEmpty()
  @IsArray()
  readonly ccTo: string[];

  @ApiProperty({
    example: '2015-03-25T12:00:00Z',
    description: 'The date you want to take a day off',
  })
  @IsNotEmpty()
  @IsDateString()
  readonly dateOffStart: string;

  @ApiProperty({
    example: '2015-03-25T12:00:00Z',
    description: 'The date you want to take a day off',
  })
  @IsNotEmpty()
  @IsDateString()
  readonly dateOffEnd: string;

  @ApiProperty({
    example: '2015-03-25T12:00:00Z',
    description: 'The date you want to rework',
  })
  @IsNotEmpty()
  @IsDateString()
  readonly reworkDateStart: string;

  @ApiProperty({
    example: '2015-03-25T12:00:00Z',
    description: 'The date you want to rework',
  })
  @IsNotEmpty()
  @IsDateString()
  readonly reworkDateEnd: string;
}
