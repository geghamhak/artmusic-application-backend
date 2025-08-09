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
export class ApplicationComposition {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: '255' })
  title: string;

  @Column({ type: 'varchar', length: '255' })
  duration: string;

  @ManyToOne(() => Application, (application) => application.compositions, {
    onDelete: 'CASCADE',
  })
  application: Application;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
