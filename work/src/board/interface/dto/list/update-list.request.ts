import { ApiProperty } from '@nestjs/swagger';
import { IsHexColor, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateListRequest {
  @ApiProperty({ nullable: true, example: 'List 1' })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({ example: '#ffc300', nullable: true })
  @IsOptional()
  @IsHexColor()
  readonly color?: string;

  @ApiProperty({ nullable: true, example: '1' })
  @IsOptional()
  @IsNumber()
  readonly order?: number;
}
