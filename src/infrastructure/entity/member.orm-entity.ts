import { Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Board } from './board.orm-entity';
import { Comment } from './comment.orm-entity';
import { User } from './user.orm-entity';

@Entity()
export class Member {
  @PrimaryColumn()
  readonly id: string;

  @ManyToOne(() => User, (user) => user.memberOf, {
    nullable: true,
  })
  user: User;

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
