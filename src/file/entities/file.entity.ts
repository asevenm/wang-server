import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  originalname: string;

  @Column()
  mimetype: string;

  @Column()
  size: number;

  @Column()
  path: string;

  @Column({ nullable: true })
  url: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: 'file' })
  type: string; // 'image', 'document', 'video', 'audio', etc.

  @CreateDateColumn()
  createdAt: Date;
}
