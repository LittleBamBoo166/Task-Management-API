import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Task } from './task.orm-entity';

@Entity()
export class Attachment {
  @PrimaryColumn()
  id: string;

  @Column()
  storageUri: string;

  @Column()
  fileName: string;

  @ManyToOne(() => Task, (task) => task.attachments)
  task: Task;
}
