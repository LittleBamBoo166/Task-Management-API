import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Board } from './board.orm-entity';

@Entity()
export class Label {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ default: '#F3F3F3' })
  color: string;

  @ManyToOne(() => Board, (board) => board.labels, {
    nullable: true,
  })
  board: Board;

  constructor(id: string) {
    this.id = id;
  }
}
