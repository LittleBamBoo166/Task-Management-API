import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Task } from './task.orm-entity';

@Entity()
export class Todo {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: true, default: null })
  parentTodoId: string;

  @Column({ default: false })
  checked: boolean;

  @Column()
  name: string;

  @ManyToOne(() => Task, (task) => task.todos)
  task: Task;
}
