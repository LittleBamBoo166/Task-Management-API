import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AbsenceRequest } from './absence-request.orm-entity';

@Entity()
export class AbsenceType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  remainingDate: number;

  @Column()
  year: number;

  @Column()
  userId: string;

  @OneToMany(() => AbsenceRequest, (request) => request.type)
  absenceRequest: AbsenceRequest[];

  constructor(id: number) {
    this.id = id;
  }
}
