import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Festival } from '../../festivals/entities/festival.entity';

@Entity()
export class FestivalConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'tinyint', nullable: true, default: 0 })
  secondComposition: number;

  @Column({ type: 'tinyint', nullable: true, default: 0 })
  thirdComposition: number;

  @Column({ type: 'tinyint', nullable: true, default: 0 })
  isOnline: number;

  @OneToOne(() => Festival, (festival) => festival.config, {
    onDelete: 'CASCADE',
  })
  festival?: Festival;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
