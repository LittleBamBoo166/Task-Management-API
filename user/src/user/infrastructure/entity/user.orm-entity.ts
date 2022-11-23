import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn({ update: false })
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ select: false, nullable: true })
  password?: string;

  @Column({ default: false })
  isComfirmed: boolean;

  @Column({ select: false, nullable: true })
  refreshToken: string;

  @Column({ default: 'user' })
  role: string;
}
