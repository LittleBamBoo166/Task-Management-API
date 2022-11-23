import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateWorkOvertimeRequestRequest {
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
    example: '[dateStart, dateEnd][]',
    description: 'The date you want to work overtime',
  })
  @IsNotEmpty()
  @IsArray()
  readonly date: [string, string][];
}
