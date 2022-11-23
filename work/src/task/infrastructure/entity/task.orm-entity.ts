import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Attachment } from './attachment.orm-entity';
import { Comment } from 'src/task/infrastructure/entity/comment.orm-entity';
import { Todo } from './todo.orm-entity';
import { Member } from 'src/board/infrastructure/entity/member.orm-entity';
import { Label } from 'src/board/infrastructure/entity/label.orm-entity';
import { List } from 'src/board/infrastructure/entity/list.orm-entity';

@Entity()
export class Task {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ type: 'timestamp', nullable: true })
  dueDate: string;

  @Column({ default: 0 })
  priority: number;

  @Column({ type: 'decimal' })
  order: number;

  @Column({ nullable: true, default: null })
  currentActive: string;

  @ManyToMany(() => Member)
  @JoinTable()
  members?: Member[];

  @ManyToMany(() => Label)
  @JoinTable()
  labels?: Label[];

  @ManyToOne(() => List, (list) => list.tasks, { onDelete: 'SET NULL' })
  list: List;

  @Column({ nullable: true })
  _listId?: string;

  @OneToMany(() => Attachment, (attachment) => attachment.task)
  attachments?: Attachment[];

  @OneToMany(() => Comment, (comment) => comment.task)
  comments?: Comment[];

  @OneToMany(() => Todo, (todo) => todo.task)
  todos?: Todo[];

  constructor(id: string) {
    this.id = id;
  }
}
