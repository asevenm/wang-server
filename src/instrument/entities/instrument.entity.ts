import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Type } from './type.entity';
import { Feature } from './feature.entity';
import { Model } from './model.entity';
import { Image } from './image.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Instrument {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  creator: string;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createTime: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updateTime: Date;

  @Column()
  updator: string;

  @OneToMany(() => Image, (picture) => picture.instrument, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @Exclude({ toPlainOnly: true })
  images: Image[];

  @Column()
  name: string;

  @ManyToOne(() => Type, (type) => type.instruments)
  @JoinColumn()
  type: Type;

  @Column()
  desc: string;

  @OneToMany(() => Feature, (feature) => feature.instrument, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @Exclude({ toPlainOnly: true })
  features: Feature[];

  @OneToMany(() => Model, (model) => model.instrument, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @Exclude({ toPlainOnly: true })
  models: Model[];

  @Column()
  region: string;
}
