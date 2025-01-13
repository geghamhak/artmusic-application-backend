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
import { TextContent } from '../../translations/entities/textContent.entity';
import { SubNomination } from '../../sub-nominations/entities/sub-nomination.entity';
import { FestivalType } from '../../festival-types/entities/festival-type.entity';
import { Application } from '../../applications/entities/application.entity';

@Entity()
export class Nomination {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => TextContent)
  @JoinColumn()
  name: TextContent;

  @OneToMany(() => SubNomination, (subNomination) => subNomination.nomination)
  subNominations: SubNomination[];

  @ManyToOne(() => FestivalType, (festivalType) => festivalType.nominations)
  festivalType: FestivalType;

  @OneToMany(() => Application, (application) => application.festival)
  applications: Application[];

  @Column({ type: 'varchar', length: '255', nullable: true })
  key?: string;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
