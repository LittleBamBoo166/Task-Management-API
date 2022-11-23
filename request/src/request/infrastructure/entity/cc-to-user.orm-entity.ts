import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Request } from './request.orm-entity';

@Entity()
export class CcToUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @OneToMany(() => Request, (request) => request.ccTo)
  request: Request;
}
