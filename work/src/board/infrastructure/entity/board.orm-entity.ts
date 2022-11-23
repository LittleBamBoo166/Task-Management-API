import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Member } from './member.orm-entity';
import { List } from './list.orm-entity';
import { Label } from './label.orm-entity';

@Entity()
export class Board {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  userId: string;

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
