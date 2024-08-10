import { CreateApplicationDto } from './dto/create-application.dto';
import { Application } from './entities/application.entity';
import { ParticipantVideoLinksService } from '../participant-video-links/participant-video-links.service';
import { ParticipantsService } from '../participants/participants.service';
import { ParticipantRecordingsService } from '../participant-recordings/participant-recordings.service';
import { ParticipantDocumentsService } from '../participant-documents/participant-documents.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from '../countries/entities/country.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Nomination } from '../nominations/entities/nomination.entity';
import { ParticipantType } from '../participant-types/entities/participant-type.entity';
import { School } from '../schools/entities/school.entity';
import { Region } from '../regions/entities/region.entity';
import { ScoringSystemService } from '../scoring-system/scoring-system.service';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
    private participantVideoLinksService: ParticipantVideoLinksService,
    private participantsService: ParticipantsService,
    private participantRecordingsService: ParticipantRecordingsService,
    private participantDocumentsService: ParticipantDocumentsService,
    private scoringSystemService: ScoringSystemService,
  ) {}
  async create(createApplicationDto: CreateApplicationDto) {
    try {
      const application = new Application();
      const {
        isFree,
        firstComposition,
        secondComposition,
        leaderFirstName,
        participants,
        participantTypeId,
        countryId,
        leaderLastName,
        nominationId,
        isOnline,
        phoneNumber,
        quantity,
        regionName,
        schoolName,
        uploadedAudio,
        uploadedImages,
        totalDuration,
        videoLinks,
        email,
        regionId,
        schoolId,
      } = createApplicationDto;
      application.isFree = isFree;
      application.firstComposition = firstComposition;
      application.secondComposition = secondComposition;
      application.leaderFirstName = leaderFirstName;
      application.leaderLastName = leaderLastName;
      application.isOnline = isOnline;
      application.email = email;
      application.phoneNumber = phoneNumber;
      application.quantity = quantity;
      application.totalDuration = totalDuration;
      application.participantVideoLinks =
        this.participantVideoLinksService.create(videoLinks);
      application.participants = this.participantsService.create(participants);
      application.participantRecordings =
        this.participantRecordingsService.create(uploadedAudio);
      application.participantDocuments =
        this.participantDocumentsService.create(uploadedImages);
      application.nomination = { id: nominationId } as Nomination;
      application.participantType = {
        id: participantTypeId,
      } as ParticipantType;
      application.country = { id: countryId } as Country;

      if (schoolId) {
        application.school = { id: schoolId } as School;
      } else {
        application.schoolName = schoolName;
      }

      if (regionId) {
        application.region = { id: regionId } as Region;
      } else {
        application.regionName = regionName;
      }

      await this.applicationRepository.save(application);
    } catch (e) {
      throw new Error(e);
    }
  }

  findAll() {
    return this.applicationRepository.find();
  }

  findOne(id: number) {
    return this.applicationRepository.findOneBy({ id });
  }

  async update(id: number, updateApplicationDto: UpdateApplicationDto) {
    const application = await this.findOne(id);
    const { score } = updateApplicationDto;
    const scoringSystem = await this.scoringSystemService.determinePlaceByScore(
      score,
      application.festival.festivalType.id,
    );
    application.place = scoringSystem.place;
    application.score = score;
    return this.applicationRepository.update({ id }, application);
  }
}
