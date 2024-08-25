import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FestivalType } from '../../festival-types/entities/festival-type.entity';
import { Application } from '../../applications/entities/application.entity';
import { TextContent } from '../../translations/entities/textContent.entity';

@Entity()
export class ScoringSystem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'tinyint' })
  minAmount: number;

  @Column({ type: 'tinyint' })
  maxAmount: number;

  @OneToOne(() => TextContent)
  @JoinColumn()
  name: TextContent;

  @OneToMany(() => Application, (application) => application.place)
  applications: Application[];

  @ManyToOne(() => FestivalType, (festivalType) => festivalType.nominations)
  festivalType: FestivalType;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: string;
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: string;
}
