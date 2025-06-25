import { CreateParticipantDto } from '../../participants/dto/create-participant.dto';
import { HasMimeType, IsFiles } from 'nestjs-form-data';
import { IsOptional } from 'class-validator';
import { FileSystemStoredFile } from 'nestjs-form-data/dist/classes/storage/FileSystemStoredFile';
import { ParticipantTypeEnum } from '../../participants/participants.service';
import { CreateApplicationCompositionDto } from '../../application-composition/dto/create-application-composition.dto';

export class CreateApplicationDto {
  countryId: number;
  languageCode: string;
  festivalId: number;
  applicationCompositions: CreateApplicationCompositionDto[];
  totalDuration?: string;
  email: string;
  isFree: boolean;
  isOnline: boolean;
  leaderFirstName: string;
  leaderLastName: string;
  participantType: ParticipantTypeEnum;
  participants?: CreateParticipantDto[];
  code?: string;
  country?: string;
  subNominationId: number;
  subNomination?: string;
  nomination?: string;
  phoneNumber: string;
  quantity?: number;
  isOrchestra?: boolean;
  schoolId?: number;
  school?: string;
  schoolName?: string;
  regionId?: number;
  region?: string;
  regionName?: string;
  @IsFiles()
  @HasMimeType(['image/jpeg', 'image/png'], { each: true })
  uploadedImages: FileSystemStoredFile[];
  @IsFiles()
  @IsOptional()
  @HasMimeType(['audio/mpeg', 'audio/mp3'], { each: true })
  uploadedAudio?: FileSystemStoredFile[];
  videoLinks?: string[];
  overallScore?: number;
  averageScore?: number;
}
