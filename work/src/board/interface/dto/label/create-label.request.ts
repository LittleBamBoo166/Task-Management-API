import { ApiProperty } from '@nestjs/swagger';
import { IsHexColor, IsNotEmpty, IsString } from 'class-validator';

export class CreateLabelRequest {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ nullable: false, example: 'Label 1' })
  readonly name: string;

  @IsHexColor()
  @ApiProperty({ nullable: true, example: '#ffc300' })
  readonly color?: string;
}
