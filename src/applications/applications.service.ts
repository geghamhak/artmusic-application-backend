import { CreateApplicationDto } from './dto/create-application.dto';
import { Application } from './entities/application.entity';
import { ParticipantVideoLinksService } from '../participant-video-links/participant-video-links.service';
import { ParticipantsService } from '../participants/participants.service';
import { ParticipantRecordingsService } from '../participant-recordings/participant-recordings.service';
import { ParticipantDocumentsService } from '../participant-documents/participant-documents.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from '../countries/entities/country.entity';
import { Repository, UpdateResult } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ParticipantType } from '../participant-types/entities/participant-type.entity';
import { School } from '../schools/entities/school.entity';
import { Region } from '../regions/entities/region.entity';
import { ScoringSystemService } from '../scoring-system/scoring-system.service';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { SubNomination } from '../sub-nominations/entities/sub-nomination.entity';
import { ScoringSystem } from '../scoring-system/entities/scoring-system.entity';
import { ApplicationScoreService } from '../application-score/application-score.service';
import { FestivalsService } from '../festivals/festivals.service';

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
    private applicationScoreService: ApplicationScoreService,
    private festivalService: FestivalsService,
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
        nomination,
        subNominationId,
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
        festivalName,
      } = createApplicationDto;
      application.isFree = !!isFree;
      application.firstComposition = firstComposition;
      if (secondComposition) {
        application.secondComposition = secondComposition;
      }
      application.leaderFirstName = leaderFirstName;
      application.leaderLastName = leaderLastName;
      application.isOnline = !!isOnline;
      application.email = email;
      application.phoneNumber = phoneNumber;
      application.quantity = quantity;
      application.participantDocuments =
        await this.participantDocumentsService.create(uploadedImages);
      if (totalDuration) {
        application.totalDuration = totalDuration;
      }
      if (videoLinks) {
        application.participantVideoLinks =
          await this.participantVideoLinksService.create(videoLinks);
      }
      if (participants && participants.length > 0) {
        application.participants =
          await this.participantsService.create(participants);
      }
      if (uploadedAudio && uploadedAudio.length > 0) {
        application.participantRecordings =
          await this.participantRecordingsService.create(uploadedAudio);
      }
      if (subNominationId) {
        application.subNomination = { id: subNominationId } as SubNomination;
      } else {
        application.nomination = nomination;
      }
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

      application.festival =
        await this.festivalService.findActiveByName(festivalName);

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

  async update(id: number, updateApplicationDto: UpdateApplicationDto) {}

  async addApplicationScore(createApplicationScoreDto): Promise<UpdateResult> {
    await this.applicationScoreService.create(createApplicationScoreDto);
    const { scores, applicationId: id } = createApplicationScoreDto;
    const application = await this.findOne(id);
    const overallScore = scores.reduce((total, current) => {
      return total + current;
    }, 0);

    const averageScore = Math.round((overallScore / scores.length) * 100) / 100;
    const scoringSystem = await this.scoringSystemService.determinePlaceByScore(
      averageScore,
      application.festival.type.id,
    );
    application.place = { id: scoringSystem.id } as ScoringSystem;
    application.totalScore = overallScore;
    return this.applicationRepository.update({ id }, application);
  }
}
