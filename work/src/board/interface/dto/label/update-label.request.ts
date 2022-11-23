import { ApiProperty } from '@nestjs/swagger';
import { IsHexColor, IsOptional, IsString } from 'class-validator';

export class UpdateLabelRequest {
  @ApiProperty({ nullable: true, example: 'Label 1' })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({ nullable: true, example: '#b3831c' })
  @IsOptional()
  @IsHexColor()
  readonly color?: string;
}
