import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class History {
  @PrimaryColumn()
  id: string;

  @Column()
  userId: string;

  @CreateDateColumn()
  createOn: Date;

  @Column({ nullable: true })
  boardId?: string;

  @Column({ nullable: true })
  taskId?: string;

  @Column('jsonb', { nullable: true })
  changedContent?: object;
}
