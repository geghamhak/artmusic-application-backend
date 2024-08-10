import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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
