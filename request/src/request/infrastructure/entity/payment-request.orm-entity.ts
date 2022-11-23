import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class PaymentRequest {
  @PrimaryColumn()
  requestId: string;

  @Column()
  costs: number;

  @Column({ type: 'timestamptz' })
  receivedDate: Date;

  @Column()
  detail: string;

  @Column()
  attachmentName: string;

  @Column()
  attachmentURI: string;
}
