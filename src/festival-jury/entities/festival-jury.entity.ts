import {
    CreateDateColumn,
    Entity,
    ManyToMany, ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Festival } from '../../festivals/entities/festival.entity';
import { Jury } from '../../juries/entities/jury.entity';
import { Nomination } from '../../nominations/entities/nomination.entity';
import { SubNomination } from '../../sub-nominations/entities/sub-nomination.entity';

@Entity()
export class FestivalJury {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Festival, (festival) => festival.festivalJuries)
  festival: Festival;

  @ManyToOne(() => Jury, (jury) => jury.festivalJuries)
  jury: Jury;

  @ManyToOne(() => Nomination, (nomination) => nomination.festivalJuries)
  nomination: Nomination;

  @ManyToOne(
    () => SubNomination,
    (subNomination) => subNomination.festivalJuries,
  )
  subNomination: SubNomination;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
