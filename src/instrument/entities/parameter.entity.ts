// parameter.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Model } from './model.entity';

@Entity()
export class Parameter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  value: string;

  @ManyToOne(() => Model, (model) => model.params, {
    onDelete: 'CASCADE',
  })
  model: Model;
}
