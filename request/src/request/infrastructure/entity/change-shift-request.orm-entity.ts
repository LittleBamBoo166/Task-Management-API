import { Shift } from 'src/request/domain/request.type';
import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class ChangeShiftRequest {
  @PrimaryColumn()
  requestId: string;

  @Column()
  substituteId: string;

  @Column({ type: 'timestamptz' })
  dateToChange: Date;

  @Column({ type: 'enum', enum: Shift })
  shiftToChange: Shift;

  @Column({ type: 'timestamptz' })
  dateChangedTo: Date;

  @Column({ type: 'enum', enum: Shift })
  shiftChangedTo: Shift;
}
