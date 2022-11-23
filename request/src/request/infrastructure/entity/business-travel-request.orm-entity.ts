import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class BusinessTravelRequest {
  @PrimaryColumn()
  requestId: string;

  @Column()
  purpose: string;

  @Column({ type: 'timestamptz' })
  dateStart: Date;

  @Column({ type: 'timestamptz' })
  dateEnd: Date;

  @Column('jsonb')
  travelExpenses: object;

  @Column()
  attachmentName: string;

  @Column()
  attachmentURI: string;
}
