import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class UpdateAttachmentRequest {
  @ApiProperty({
    nullable: false,
    description: 'The file name',
    example: 'dog.png',
  })
  @IsNotEmpty()
  @IsString()
  fileName: string;

  @ApiProperty({
    nullable: false,
    description: 'The storeage URI of this file',
    example: 'https://docs.nestjs.com/microservices/basics',
  })
  @IsNotEmpty()
  @IsUrl()
  storageUri: string;
}
