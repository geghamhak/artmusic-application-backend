import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Festival } from '../../festivals/entities/festival.entity';
import { Country } from '../../countries/entities/country.entity';
import { Participant } from '../../participants/entities/participant.entity';
import { ParticipantRecording } from '../../participant-recordings/entities/participant-recording.entity';
import { ParticipantVideoLink } from '../../participant-video-links/entities/participant-video-link.entity';
import { ParticipantDocument } from '../../participant-documents/entities/participant-document.entity';
import { School } from '../../schools/entities/school.entity';
import { Region } from '../../regions/entities/region.entity';
import { SubNomination } from '../../sub-nominations/entities/sub-nomination.entity';
import { ApplicationScore } from '../../application-score/entities/application-score.entity';
import { ApplicationComposition } from '../../application-composition/entities/application-composition.entity';
import { IsOptional } from 'class-validator';
import { Nomination } from '../../nominations/entities/nomination.entity';

@Entity()
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: true })
  code: number;

  @Column({ type: 'tinyint' })
  isFree: boolean;

  @Column({ type: 'tinyint' })
  isOnline: boolean;

  @Column({ type: 'varchar', length: '255', nullable: true })
  totalDuration?: string;

  @Column({ type: 'varchar', length: '255' })
  email: string;

  @Column({ type: 'varchar', length: '255' })
  phoneNumber: string;

  @Column({ type: 'int', nullable: true })
  quantity: number;

  @Column({ type: 'varchar', length: '255' })
  leaderFirstName: string;

  @Column({ type: 'varchar', length: '255' })
  leaderLastName: string;

  @Column({ type: 'varchar', length: '255', nullable: true })
  schoolName: string;

  @ManyToOne(() => School, (school) => school.applications)
  school?: School;

  @Column({ type: 'varchar', length: '255', nullable: true })
  regionName: string;

  @ManyToOne(() => Region, (region) => region.applications)
  region?: Region;

  @Column({ type: 'int', nullable: true })
  totalScore: number;

  @Column({ type: 'float', nullable: true })
  averageScore: number;

  @Column({ type: 'varchar', length: '50', nullable: true })
  place?: string;

  @Column({ type: 'date', nullable: true })
  performanceDate: string;

  @Column({ type: 'varchar', length: '50', nullable: true })
  performanceTime: string;

  @ManyToOne(() => Festival, (festival) => festival.applications)
  festival: Festival;

  @ManyToOne(() => Country, (country) => country.applications)
  country: Country;

  @ManyToOne(() => SubNomination, (subNomination) => subNomination.applications)
  subNomination: SubNomination;

  @ManyToOne(() => Nomination, (nomination) => nomination.applications)
  @IsOptional()
  nomination: Nomination;

  @OneToMany(
    () => ApplicationScore,
    (applicationScore) => applicationScore.application,
    { cascade: ['remove'] },
  )
  scores?: ApplicationScore[];

  @OneToMany(
    () => ApplicationComposition,
    (applicationComposition) => applicationComposition.application,
    { cascade: ['remove'] },
  )
  compositions?: ApplicationComposition[];

  @Column({ type: 'varchar', length: '255' })
  participantType: string;

  @ManyToMany(() => Participant, (participant) => participant.applications)
  participants: Participant[];

  @OneToMany(
    () => ParticipantRecording,
    (participantRecording) => participantRecording.application,
    { cascade: ['remove'] },
  )
  participantRecordings?: ParticipantRecording[];

  @OneToMany(
    () => ParticipantVideoLink,
    (participantVideoLink) => participantVideoLink.application,
    { cascade: ['remove'] },
  )
  participantVideoLinks?: ParticipantVideoLink[];

  @OneToMany(
    () => ParticipantDocument,
    (participantDocument) => participantDocument.application,
    { cascade: ['remove'] },
  )
  participantDocuments: ParticipantDocument[];

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
