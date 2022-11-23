import { ApiProperty } from '@nestjs/swagger';
import { IsHexColor, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateListRequest {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ nullable: false, description: 'List name' })
  readonly name: string;

  @IsHexColor()
  @ApiProperty({
    nullable: true,
    example: '#ffc300',
    description: 'List color',
  })
  readonly color?: string;

  @IsNumber()
  @ApiProperty({ nullable: true, description: 'List order' })
  readonly order?: number;
}
