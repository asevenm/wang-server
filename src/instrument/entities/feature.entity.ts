import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Instrument } from './instrument.entity';
import { FeatureImage } from './featureImage.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Feature {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @OneToMany(() => FeatureImage, (picture) => picture.feature)
  images: FeatureImage[];

  @ManyToOne(() => Instrument, (instrument) => instrument.features, {
    onDelete: 'CASCADE',
  })
  @Exclude({ toPlainOnly: true })
  @JoinColumn()
  instrument: Instrument;

  // If you want to associate with Picture entity, add Picture relationship here
}
