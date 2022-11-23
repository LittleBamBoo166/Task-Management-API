import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ManyToOne } from 'typeorm/decorator/relations/ManyToOne';
import { Request } from './request.orm-entity';

@Entity()
export class Approver {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  userId: string;

  @Column()
  order: number;

  @Column()
  isDefault: boolean;

  @ManyToOne(() => Request, (request) => request.approvers)
  request: Request;
}
