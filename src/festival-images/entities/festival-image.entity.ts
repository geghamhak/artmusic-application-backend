import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SubNomination } from '../../sub-nominations/entities/sub-nomination.entity';
import { Festival } from '../../festivals/entities/festival.entity';
import { TextContent } from '../../translations/entities/textContent.entity';

@Entity()
export class FestivalImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  code: number;

  @OneToOne(() => TextContent)
  @JoinColumn()
  title: TextContent;

  @ManyToOne(() => Festival, (festival) => festival.festivalImages)
  festival?: Festival;

  @ManyToOne(
    () => SubNomination,
    (subNomination) => subNomination.festivalImages,
  )
  subNomination?: SubNomination;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
