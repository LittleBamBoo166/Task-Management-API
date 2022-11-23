import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class SalaryAndBenefitsRequest {
  @PrimaryColumn()
  requestId: string;

  @Column()
  type: string;
}
