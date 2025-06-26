import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class AgentBrand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  icon: string; // 存储图标的 URL 或文件名
}
