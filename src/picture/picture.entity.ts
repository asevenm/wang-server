import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Instrument } from 'src/instrument/entities/instrument.entity';

@Entity()
export class Picture {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  desc: string;

  @Column()
  url: string;

  @ManyToOne(() => Instrument, (instrument) => instrument.images)
  instrument: Instrument; // 修正拼写错误：insturument -> instrument
}
