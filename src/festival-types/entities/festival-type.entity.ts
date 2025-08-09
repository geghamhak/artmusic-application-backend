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
import { Festival } from '../../festivals/entities/festival.entity';

@Entity()
export class FestivalType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: '255' })
  key: string;

  @OneToOne(() => TextContent)
  @JoinColumn()
  name: TextContent;

  @OneToOne(() => TextContent)
  @JoinColumn()
  description: TextContent;

  @Column({ type: 'simple-array', nullable: true })
  subNominationIds: number[];

  @Column({ type: 'tinyint', default: 0 })
  isOnline: number;

  @Column({ type: 'tinyint', default: 0 })
  secondComposition: number;

  @Column({ type: 'tinyint', default: 0 })
  thirdComposition: number;

  @Column({ type: 'tinyint', default: 15 })
  compositionTotalDuration: number;

  @Column({ type: 'tinyint', default: 0 })
  isParticipantTypeActive: number;

  @OneToMany(() => Festival, (festival) => festival.type)
  festivals: Festival[];

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
