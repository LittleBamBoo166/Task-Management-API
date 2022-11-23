import {
  RequestType,
  StageType,
  StatusType,
} from 'src/request/domain/request.type';
import { Entity, PrimaryColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { CreateDateColumn } from 'typeorm/decorator/columns/CreateDateColumn';
import { UpdateDateColumn } from 'typeorm/decorator/columns/UpdateDateColumn';
import { Approver } from './approver.orm-entity';
import { CcToUser } from './cc-to-user.orm-entity';

@Entity()
export class Request {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'enum', enum: RequestType })
  type: RequestType;

  @CreateDateColumn()
  createAt?: Date;

  @UpdateDateColumn()
  updateAt?: Date;

  @Column()
  message: string;

  @Column({ type: 'enum', enum: StatusType })
  status: StatusType;

  @Column({ type: 'enum', enum: StageType })
  stage: StageType;

  @Column()
  requesterId: string;

  @OneToMany(() => CcToUser, (user) => user.request)
  ccTo: CcToUser[];

  @OneToMany(() => Approver, (approver) => approver.request, { cascade: true })
  approvers: Approver[];
}
