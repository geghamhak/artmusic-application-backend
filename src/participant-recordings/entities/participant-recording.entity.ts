import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Application } from '../../applications/entities/application.entity';

@Entity()
export class ParticipantRecording {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Application, (application) => application.participants)
  application: Application;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: string;
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: string;
}
