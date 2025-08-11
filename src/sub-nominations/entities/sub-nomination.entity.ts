import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Nomination } from '../../nominations/entities/nomination.entity';
import { TextContent } from '../../translations/entities/textContent.entity';
import { Application } from '../../applications/entities/application.entity';
import { FestivalJury } from '../../festival-jury/entities/festival-jury.entity';

@Entity()
export class SubNomination {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => TextContent)
  @JoinColumn()
  name: TextContent;

  @Column({ type: 'smallint' })
  priority: number;

  @ManyToOne(() => Nomination, (nomination) => nomination.subNominations)
  nomination: Nomination;

  @OneToMany(() => Application, (application) => application.subNomination)
  applications: Application[];

  @OneToMany(() => FestivalJury, (festivalJury) => festivalJury.subNomination, {
    nullable: true,
  })
  festivalJuries?: FestivalJury[];

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
