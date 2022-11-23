import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTodoRequest {
  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsString()
  parentTodoId?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}
