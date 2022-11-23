import { DateValueObject } from 'src/request/domain/date.value-object';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class ReworkRequest {
  @PrimaryColumn()
  requestId: string;

  @Column('jsonb')
  dateOff: DateValueObject;

  @Column('jsonb')
  reworkDate: DateValueObject;
}
