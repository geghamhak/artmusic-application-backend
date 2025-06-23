import { CreateParticipantDto } from '../../participants/dto/create-participant.dto';
import { HasMimeType, IsFiles } from 'nestjs-form-data';
import { IsOptional } from 'class-validator';
import { FileSystemStoredFile } from 'nestjs-form-data/dist/classes/storage/FileSystemStoredFile';
import { ApplicationComposition } from '../../application-composition/entities/application-composition.entity';
import { ParticipantType } from '../../participants/participants.service';

export class CreateApplicationDto {
  countryId: number;
  country?: string;
  languageCode: string;
  festivalId: number;
  applicationCompositions: ApplicationComposition[];
  totalDuration?: string;
  email: string;
  isFree: boolean;
  isOnline: boolean;
  leaderFirstName: string;
  leaderLastName: string;
  participantType: ParticipantType;
  participants?: CreateParticipantDto[];
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
  scores?: number[];
}
