import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Feature } from './feature.entity';

@Entity()
export class FeatureImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @CreateDateColumn()
  createTime: Date;

  @ManyToOne(() => Feature, (feature) => feature.images, {
    onDelete: 'CASCADE',
  })
  feature: Feature;
}
