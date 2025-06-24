import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TextContent } from '../../translations/entities/textContent.entity';
import { SubNomination } from '../../sub-nominations/entities/sub-nomination.entity';
import { Application } from '../../applications/entities/application.entity';
import { FestivalJury } from '../../festival-jury/entities/festival-jury.entity';

@Entity()
export class Nomination {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => TextContent)
  @JoinColumn()
  name: TextContent;

  @Column({ type: 'smallint' })
  priority: number;

  @OneToMany(() => SubNomination, (subNomination) => subNomination.nomination)
  subNominations: SubNomination[];

  @OneToMany(() => Application, (application) => application.festival)
  applications: Application[];

  @OneToMany(() => FestivalJury, (festivalJury) => festivalJury.nomination)
  festivalJuries: FestivalJury[];

  @Column({ type: 'varchar', length: '255', nullable: true })
  key?: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
