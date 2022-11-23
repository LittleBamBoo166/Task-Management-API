import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateTodoRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsUUID()
  parentTodoId?: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  checked?: boolean;
}
