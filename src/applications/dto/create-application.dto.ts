import { CreateParticipantDto } from '../../participants/dto/create-participant.dto';
import { HasMimeType, IsFiles } from 'nestjs-form-data';
import { IsOptional } from 'class-validator';
import { FileSystemStoredFile } from 'nestjs-form-data/dist/classes/storage/FileSystemStoredFile';
import { FestivalsEnum } from '../../festivals/festivals.service';

export class CreateApplicationDto {
  countryId: number;
  festivalName: FestivalsEnum;
  firstComposition: string;
  secondComposition?: string;
  totalDuration?: string;
  email: string;
  isFree: boolean;
  isOnline: boolean;
  leaderFirstName: string;
  leaderLastName: string;
  participants: CreateParticipantDto[];
  subNominationId: number;
  nomination?: string;
  phoneNumber: string;
  quantity: number;
  participantTypeId?: number;
  schoolId?: number;
  schoolName?: string;
  regionId?: number;
  regionName?: string;
  @IsFiles()
  @HasMimeType(['image/jpeg', 'image/png'], { each: true })
  uploadedImages: FileSystemStoredFile[];
  @IsFiles()
  @IsOptional()
  @HasMimeType(['audio/mpeg', 'audio/mp3'], { each: true })
  uploadedAudio?: FileSystemStoredFile[];
  videoLinks?: string[];
}
