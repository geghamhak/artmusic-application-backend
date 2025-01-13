import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Festival } from '../../festivals/entities/festival.entity';
import { Country } from '../../countries/entities/country.entity';
import { Participant } from '../../participants/entities/participant.entity';
import { ParticipantType } from '../../participant-types/entities/participant-type.entity';
import { ParticipantRecording } from '../../participant-recordings/entities/participant-recording.entity';
import { ParticipantVideoLink } from '../../participant-video-links/entities/participant-video-link.entity';
import { ParticipantDocument } from '../../participant-documents/entities/participant-document.entity';
import { School } from '../../schools/entities/school.entity';
import { Region } from '../../regions/entities/region.entity';
import { SubNomination } from '../../sub-nominations/entities/sub-nomination.entity';
import { ApplicationScore } from '../../application-score/entities/application-score.entity';
import { ScoringSystem } from '../../scoring-system/entities/scoring-system.entity';
import { ApplicationComposition } from '../../application-composition/entities/application-composition.entity';

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

  @Column({ type: 'int' })
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

  @ManyToOne(() => ScoringSystem, (scoringSystem) => scoringSystem.applications)
  place?: ScoringSystem;

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

  @Column({ type: 'varchar', length: '50', nullable: true })
  nomination: string;

  @OneToMany(
    () => ApplicationScore,
    (applicationScore) => applicationScore.application,
  )
  scores?: ApplicationScore[];

  @OneToMany(
    () => ApplicationComposition,
    (applicationComposition) => applicationComposition.application,
  )
  compositions?: ApplicationComposition[];

  @ManyToOne(
    () => ParticipantType,
    (participantType) => participantType.applications,
  )
  participantType?: ParticipantType;

  @OneToMany(() => Participant, (participant) => participant.application)
  participants: Participant[];

  @OneToMany(
    () => ParticipantRecording,
    (participantRecording) => participantRecording.application,
  )
  participantRecordings?: ParticipantRecording[];

  @OneToMany(
    () => ParticipantVideoLink,
    (participantVideoLink) => participantVideoLink.application,
  )
  participantVideoLinks?: ParticipantVideoLink[];

  @OneToMany(
    () => ParticipantDocument,
    (participantDocument) => participantDocument.application,
  )
  participantDocuments: ParticipantDocument[];

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
