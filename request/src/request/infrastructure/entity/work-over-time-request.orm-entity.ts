import { DateValueObject } from 'src/request/domain/date.value-object';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class WorkOverTimeRequest {
  @PrimaryColumn()
  requestId: string;

  @Column('jsonb')
  date: DateValueObject[];
}
