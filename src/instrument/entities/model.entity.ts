import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Instrument } from './instrument.entity';
import { Parameter } from './parameter.entity';

@Entity()
export class Model {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Parameter, (parameter) => parameter.model, { cascade: true })
  params: Parameter[];

  @ManyToOne(() => Instrument, (instrument) => instrument.models, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  instrument: Instrument;
}
