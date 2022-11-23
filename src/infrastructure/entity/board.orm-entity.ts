import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Member } from './member.orm-entity';
import { List } from './list.orm-entity';
import { User } from './user.orm-entity';
import { Label } from './label.orm-entity';

@Entity()
export class Board {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.boards, {
    nullable: true,
  })
  owner: User;

  @OneToMany(() => List, (list) => list.board)
  lists?: List[];

  @OneToMany(() => Member, (member) => member.board)
  members?: Member[];

  @OneToMany(() => Label, (label) => label.board)
  labels?: Label[];

  constructor(id: string) {
    this.id = id;
  }
}
