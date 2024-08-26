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
  insturument: Instrument;
}
