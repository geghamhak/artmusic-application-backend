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

  @Column({ type: 'boolean', nullable: true })
  secondComposition: boolean;

  @Column({ type: 'boolean', nullable: true })
  thirdComposition: boolean;

  @Column({ type: 'boolean', nullable: true })
  isOnline: boolean;

  @OneToOne(() => Festival, (festival) => festival.config, {
    onDelete: 'CASCADE',
  })
  festival?: Festival;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
