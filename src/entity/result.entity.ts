import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Result {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  category: string;

  @Column()
  type: string;

  @Column()
  difficulty: string;

  @Column()
  question: string;

  @Column()
  correct_answer: string;

  @Column({ array: true, default: [''] })
  incorrect_answers: string;
}
