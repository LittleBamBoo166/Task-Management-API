import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Member } from './member.orm-entity';
import { Board } from './board.orm-entity';

@Entity()
export class User {
  @PrimaryColumn({ update: false })
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ select: false, nullable: true })
  refreshToken: string;

  @OneToMany(() => Board, (board) => board.owner)
  boards?: Board[];

  @OneToMany(() => Member, (member) => member.user)
  memberOf?: Member[];

  constructor(id: string) {
    this.id = id;
  }
}
