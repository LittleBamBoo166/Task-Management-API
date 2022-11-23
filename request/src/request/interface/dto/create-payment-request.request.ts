import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsArray,
  IsNumber,
  IsDateString,
  IsUrl,
} from 'class-validator';

export class CreatePaymentRequestRequest {
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
    example: 'Lunch fee',
    description: 'Type of payment',
  })
  @IsNotEmpty()
  @IsString()
  readonly type: string;

  @ApiProperty({
    example: '100000',
    description: 'Requested money',
  })
  @IsNotEmpty()
  @IsNumber()
  readonly amount: number;

  @ApiProperty({
    example: '2015-03-25',
    description: 'Received date',
  })
  @IsNotEmpty()
  @IsDateString()
  readonly receivedDate: string;

  @ApiProperty({
    example: '1 box of chicken rice: 100000',
    description: 'Payment detail',
  })
  @IsNotEmpty()
  @IsString()
  readonly paymentDetail: string;

  @ApiProperty({
    example: 'lunch-fee.docx',
    description: 'Attachment name',
  })
  @IsNotEmpty()
  @IsString()
  readonly fileName: string;

  @ApiProperty({
    example: 'https://orkhan.gitbook.io/typeorm/docs/update-query-builder',
    description: 'Storage URI',
  })
  @IsNotEmpty()
  @IsUrl()
  readonly storageUri: string;
}
