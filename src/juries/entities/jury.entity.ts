import {
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
import { FestivalImage } from '../../festival-images/entities/festival-image.entity';
import { Festival } from '../../festivals/entities/festival.entity';
import { FestivalJury } from '../../festival-jury/entities/festival-jury.entity';

@Entity()
export class Jury {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => TextContent)
  @JoinColumn()
  title: TextContent;

  @OneToOne(() => TextContent)
  @JoinColumn()
  description: TextContent;

  @OneToMany(() => FestivalJury, (festivalJury) => festivalJury.jury)
  festivalJuries: FestivalJury[];

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
