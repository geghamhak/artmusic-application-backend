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
export class ParticipantDocument {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: '255' })
  originalName: string;

  @Column({ type: 'varchar', length: '50' })
  originalMimeType: string;

  @ManyToOne(() => Application, (application) => application.participants, {
    onDelete: 'CASCADE',
  })
  application: Application;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
