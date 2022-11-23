import { ApiProperty } from '@nestjs/swagger';
import {
  IsHexColor,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateListRequest {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ nullable: false, description: 'List name', example: 'List 1' })
  readonly name: string;

  @IsOptional()
  @IsHexColor()
  @ApiProperty({
    nullable: true,
    example: '#ffc300',
    description: 'List color',
  })
  readonly color?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ nullable: true, description: 'List order', example: '1' })
  readonly order?: number;
}
