import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateAttachmentRequest {
  @ApiProperty({ nullable: false, description: 'The file name' })
  @IsNotEmpty()
  @IsString()
  fileName: string;

  @ApiProperty({
    nullable: false,
    description: 'The storeage URI of this file',
  })
  @IsNotEmpty()
  @IsUrl()
  storageUri: string;
}
