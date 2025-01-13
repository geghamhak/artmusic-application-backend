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
export class Participant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: '255' })
  firstName: string;

  @Column({ type: 'varchar', length: '255' })
  lastName: string;

  @Column({ type: 'varchar', length: '255', nullable: true })
  fatherName: string;

  @Column({ type: 'int' })
  birthYear: number;

  @ManyToOne(() => Application, (application) => application.participants)
  application: Application;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
