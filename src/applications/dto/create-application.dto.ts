import { CreateParticipantDto } from '../../participants/dto/create-participant.dto';
import { CreateParticipantRecordingDto } from '../../participant-recordings/dto/create-participant-recording.dto';
import { CreateParticipantDocumentDto } from '../../participant-documents/dto/create-participant-document.dto';
import { CreateParticipantVideoLinkDto } from '../../participant-video-links/dto/create-participant-video-link.dto';

export class CreateApplicationDto {
  countryId: number;
  firstComposition: string;
  secondComposition: string;
  totalDuration: string;
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
  participantTypeId: number;
  schoolId?: number;
  schoolName?: string;
  regionId?: number;
  regionName?: string;
  uploadedImages: CreateParticipantDocumentDto[];
  uploadedAudio: CreateParticipantRecordingDto[];
  videoLinks: CreateParticipantVideoLinkDto[];
}
