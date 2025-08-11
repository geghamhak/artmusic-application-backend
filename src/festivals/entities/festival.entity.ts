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
import { FestivalType } from '../../festival-types/entities/festival-type.entity';
import { Application } from '../../applications/entities/application.entity';
import { FestivalJury } from '../../festival-jury/entities/festival-jury.entity';
import { FestivalConfig } from '../../festival-config/entities/festival-config.entity';

@Entity()
export class Festival {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => TextContent, { onDelete: 'CASCADE' })
  @JoinColumn()
  title: TextContent;

  @OneToOne(() => TextContent, { onDelete: 'CASCADE' })
  @JoinColumn()
  description: TextContent;

  @OneToOne(() => TextContent, { onDelete: 'CASCADE' })
  @JoinColumn()
  bannerDescription: TextContent;

  @OneToOne(() => FestivalConfig, (festivalConfig) => festivalConfig.festival)
  @JoinColumn()
  config: FestivalConfig;

  @Column({ type: 'json' })
  scorePattern: string;

  @ManyToOne(() => FestivalType, (festivalType) => festivalType.festivals)
  type: FestivalType;

  @OneToMany(() => Application, (application) => application.festival, {
    cascade: ['remove'],
  })
  applications: Application[];

  @OneToMany(() => FestivalJury, (festivalJury) => festivalJury.festival)
  festivalJuries: FestivalJury[];

  @Column({ type: 'date' })
  applicationStartDate: Date;

  @Column({ type: 'date' })
  applicationEndDate: Date;

  @Column({ type: 'date', nullable: true })
  festivalStartDate?: Date;

  @Column({ type: 'date', nullable: true })
  festivalEndDate?: Date;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
