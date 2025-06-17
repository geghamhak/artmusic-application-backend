import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinTable,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Application } from '../../applications/entities/application.entity';
import { TextContent } from '../../translations/entities/textContent.entity';
@Entity()
export class Participant {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => TextContent)
  @JoinColumn()
  firstName: TextContent;

  @OneToOne(() => TextContent)
  @JoinColumn()
  lastName: TextContent;

  @OneToOne(() => TextContent)
  @JoinColumn()
  fatherName: TextContent;

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
