import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TextContent } from '../../translations/entities/textContent.entity';
import { Nomination } from '../../nominations/entities/nomination.entity';
import { Festival } from '../../festivals/entities/festival.entity';
import { ScoringSystem } from '../../scoring-system/entities/scoring-system.entity';

@Entity()
export class FestivalType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: '255' })
  key: string;

  @OneToOne(() => TextContent)
  @JoinColumn()
  name: TextContent;

  @OneToMany(() => Nomination, (nomination) => nomination.festivalType)
  nominations: Nomination[];

  @OneToMany(() => ScoringSystem, (scoringSystem) => scoringSystem.festivalType)
  scoringSystem: ScoringSystem[];

  @OneToMany(() => Festival, (festival) => festival.type)
  festivals: Festival[];

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
