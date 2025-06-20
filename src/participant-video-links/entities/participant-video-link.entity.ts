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
export class ParticipantVideoLink {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: '255', nullable: true })
  link: string;

  @ManyToOne(() => Application, (application) => application.participants, {
    onDelete: 'CASCADE',
  })
  application: Application;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
