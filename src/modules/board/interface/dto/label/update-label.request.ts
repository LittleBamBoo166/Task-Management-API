import { ApiProperty } from '@nestjs/swagger';
import { IsHexColor, IsOptional, IsString } from 'class-validator';

export class UpdateLabelRequest {
  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsHexColor()
  readonly color?: string;
}
