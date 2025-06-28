import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Instrument } from './instrument.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @CreateDateColumn()
  createTime: Date;

  @ManyToOne(() => Instrument, (instrument) => instrument.images, {
    onDelete: 'CASCADE',
  })
  instrument: Instrument;
}
