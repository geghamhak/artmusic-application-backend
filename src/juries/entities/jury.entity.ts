import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TextContent } from '../../translations/entities/textContent.entity';
import { FestivalJury } from '../../festival-jury/entities/festival-jury.entity';

@Entity()
export class Jury {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => TextContent)
  @JoinColumn()
  name: TextContent;

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
