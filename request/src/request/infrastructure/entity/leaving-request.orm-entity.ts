import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class LeavingRequest {
  @PrimaryColumn()
  requestId: string;

  @Column({ type: 'timestamptz' })
  date: Date;

  @Column()
  handOverPlan: string;
}
