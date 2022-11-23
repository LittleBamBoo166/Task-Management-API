import { Comment } from 'src/task/infrastructure/entity/comment.orm-entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Board } from './board.orm-entity';

@Entity()
export class Member {
  @PrimaryColumn()
  readonly id: string;

  @Column()
  userId: string;

  @ManyToOne(() => Board, (board) => board.members, {
    nullable: true,
  })
  board: Board;

  @OneToMany(() => Comment, (comment) => comment.member)
  comments?: Comment[];

  constructor(id: string) {
    this.id = id;
  }
}
