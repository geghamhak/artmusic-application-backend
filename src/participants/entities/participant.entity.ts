import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinTable,
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

  @ManyToMany(() => Application, (application) => application.participants, {
    cascade: true,
  })
  @JoinTable()
  applications: Application[];

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
