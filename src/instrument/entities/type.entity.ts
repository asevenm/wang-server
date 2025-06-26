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

  @Column()
  type: 1 | 2; // 1: 仪器, 2: 试剂

  @TreeChildren()
  children: Type[];

  @TreeParent()
  parent: Type;

  @OneToMany(() => Instrument, (instrument) => instrument.type)
  instruments: Instrument[];
}
