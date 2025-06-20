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
export class ParticipantRecording {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Application, (application) => application.participants,  {
    onDelete: 'CASCADE',
  })
  application: Application;

  @Column({ type: 'varchar', length: '255' })
  originalName: string;

  @Column({ type: 'varchar', length: '50' })
  originalMimeType: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
