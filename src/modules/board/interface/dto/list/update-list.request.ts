import { ApiProperty } from '@nestjs/swagger';
import { IsHexColor, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateListRequest {
  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({ example: '#ffc300', nullable: true })
  @IsOptional()
  @IsHexColor()
  readonly color?: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsNumber()
  readonly order?: number;
}
