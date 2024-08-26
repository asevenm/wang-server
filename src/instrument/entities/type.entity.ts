import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Tree,
  TreeChildren,
  TreeParent,
  OneToMany,
} from 'typeorm';
import { Instrument } from './instrument.entity';

@Entity('types')
@Tree('closure-table')
export class Type {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @TreeChildren()
  children: Type[];

  @TreeParent()
  parent: Type;

  @OneToMany(() => Instrument, (instrument) => instrument.type)
  instruments: Instrument[];
}
