import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Application } from '../../applications/entities/application.entity';

@Entity()
export class ApplicationScore {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  score: number;

  @ManyToOne(() => Application, (application) => application.scores, {
    onDelete: 'CASCADE',
  })
  application?: Application;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
