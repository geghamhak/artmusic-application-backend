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

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
