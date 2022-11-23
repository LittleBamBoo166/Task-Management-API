import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { AbsenceType } from './absence-type.orm-entity';

@Entity()
export class AbsenceRequest {
  @PrimaryColumn()
  requestId: string;

  @ManyToOne(() => AbsenceType, (type) => type.absenceRequest)
  type: AbsenceType;

  @Column({ type: 'timestamptz' })
  dateStart: Date;

  @Column({ type: 'timestamptz' })
  dateEnd: Date;
}
