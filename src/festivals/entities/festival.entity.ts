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

@Entity()
export class Festival {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => TextContent)
  @JoinColumn()
  title: TextContent;

  @OneToOne(() => TextContent)
  @JoinColumn()
  description: TextContent;

  @OneToOne(() => TextContent)
  @JoinColumn()
  bannerDescription: TextContent;

  @ManyToOne(() => FestivalType, (festivalType) => festivalType.nominations)
  type: FestivalType;

  @OneToMany(() => Application, (application) => application.festival)
  applications: Application[];

  @Column({ type: 'date' })
  applicationStartDate: Date;

  @Column({ type: 'date' })
  applicationEndDate: Date;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
