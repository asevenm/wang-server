import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column('text')
  content: string;

  @Column({ default: 0 })
  status: number;

  @CreateDateColumn({ type: 'timestamp' })
  createAt: Date;
}
