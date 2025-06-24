import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Nomination } from '../../nominations/entities/nomination.entity';
import { TextContent } from '../../translations/entities/textContent.entity';
import { Application } from '../../applications/entities/application.entity';
import { FestivalImage } from '../../festival-images/entities/festival-image.entity';
import { FestivalJury } from '../../festival-jury/entities/festival-jury.entity';
import {IsOptional} from "class-validator";

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

  @OneToMany(
    () => FestivalImage,
    (festivalImage) => festivalImage.subNomination,
  )
  festivalImages: FestivalImage[];

  @OneToMany(() => FestivalJury, (festivalJury) => festivalJury.subNomination)
  @IsOptional()
  festivalJuries: FestivalJury[];

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
