import { Task } from 'src/task/infrastructure/entity/task.orm-entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Board } from './board.orm-entity';

@Entity()
export class List {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ default: '#ffc300' })
  color: string;

  @Column({ type: 'decimal' })
  order: number;

  @ManyToOne(() => Board, (board) => board.lists, {
    nullable: true,
  })
  board: Board;

  @OneToMany(() => Task, (task) => task.list)
  tasks?: Task[];

  constructor(id: string) {
    this.id = id;
  }
}
