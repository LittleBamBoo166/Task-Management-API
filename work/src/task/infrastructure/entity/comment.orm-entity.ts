import { Member } from 'src/board/infrastructure/entity/member.orm-entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Task } from './task.orm-entity';

@Entity()
export class Comment {
  @PrimaryColumn()
  id: string;

  @Column()
  content: string;

  @ManyToOne(() => Member, (member) => member.comments, {
    onDelete: 'SET NULL',
  })
  member: Member;

  @ManyToOne(() => Task, (task) => task.comments)
  task: Task;
}
