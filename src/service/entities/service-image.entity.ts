import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Service } from './service.entity';

@Entity('service_images')
export class ServiceImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  service_id: number;

  @Column({ type: 'varchar', length: 500 })
  url: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', default: 0 })
  sort_order: number;

  @ManyToOne(() => Service, service => service.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'service_id' })
  service: Service;
}