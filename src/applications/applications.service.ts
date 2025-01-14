import { CreateApplicationDto } from './dto/create-application.dto';
import { Application } from './entities/application.entity';
import { ParticipantVideoLinksService } from '../participant-video-links/participant-video-links.service';
import { ParticipantsService } from '../participants/participants.service';
import { ParticipantRecordingsService } from '../participant-recordings/participant-recordings.service';
import { ParticipantDocumentsService } from '../participant-documents/participant-documents.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from '../countries/entities/country.entity';
import { Repository, UpdateResult } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ParticipantType } from '../participant-types/entities/participant-type.entity';
import { School } from '../schools/entities/school.entity';
import { Region } from '../regions/entities/region.entity';
import { ScoringSystemService } from '../scoring-system/scoring-system.service';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { SubNomination } from '../sub-nominations/entities/sub-nomination.entity';
import { ScoringSystem } from '../scoring-system/entities/scoring-system.entity';
import { ApplicationScoreService } from '../application-score/application-score.service';
import { FestivalsService } from '../festivals/festivals.service';
import { CreateApplicationScoreDto } from '../application-score/dto/create-application-score.dto';
import { ApplicationCompositionService } from '../application-composition/application-composition.service';
import { Festival } from '../festivals/entities/festival.entity';

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
    private applicationCompositionService: ApplicationCompositionService,
  ) {}
  async create(createApplicationDto: CreateApplicationDto) {
    try {
      const application = new Application();
      const {
        isFree,
        leaderFirstName,
        participants,
        participantTypeId,
        countryId,
        leaderLastName,
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
        festivalId,
        applicationCompositions,
      } = createApplicationDto;
      const festival = await this.festivalService.findOne(festivalId);
      this.checkIfFestivalIsExpired(festival);
      application.isFree = !!isFree;
      application.leaderFirstName = leaderFirstName;
      application.leaderLastName = leaderLastName;
      application.isOnline = !!isOnline;
      application.email = email;
      application.phoneNumber = phoneNumber;
      application.quantity = quantity;
      application.participantDocuments =
        await this.participantDocumentsService.saveMany(uploadedImages);
      if (totalDuration) {
        application.totalDuration = totalDuration;
      }
      if (videoLinks) {
        application.participantVideoLinks =
          await this.participantVideoLinksService.saveMany(videoLinks);
      }
      if (participants && participants.length > 0) {
        application.participants =
          await this.participantsService.saveMany(participants);
      }
      if (uploadedAudio && uploadedAudio.length > 0) {
        application.participantRecordings =
          await this.participantRecordingsService.saveMany(uploadedAudio);
      }
      application.subNomination = { id: subNominationId } as SubNomination;

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

      application.compositions =
        await this.applicationCompositionService.saveMany(
          applicationCompositions,
        );

      application.festival = { id: festival.id } as Festival;

      await this.applicationRepository.save(application);
    } catch (e) {
      throw new Error(e);
    }
  }

  checkIfFestivalIsExpired(festival: Festival) {
    const currentDate = new Date();
    currentDate.setSeconds(0, 0);
    if (festival && festival.applicationEndDate <= currentDate) {
      throw new BadRequestException('The festival is expired');
    }
  }

  findAll() {
    return this.applicationRepository.find();
  }

  async findOne(id: number) {
    const application = await this.applicationRepository
      .createQueryBuilder('application')
      .leftJoinAndSelect('application.compositions', 'compositions')
      .leftJoinAndSelect('application.participants', 'participants')
      .leftJoinAndSelect('application.school', 'school')
      .leftJoinAndSelect('application.country', 'country')
      .leftJoinAndSelect('application.festival', 'festival')
      .leftJoinAndSelect('application.subNomination', 'subNomination')
      .leftJoinAndSelect(
        'application.participantDocuments',
        'participantDocuments',
      )
      .where('application.id= :id', { id })
      .select()
      .getOne();
    return application;
  }

  async update(id: number, updateApplicationDto: UpdateApplicationDto) {}

  async addApplicationScore(
    createApplicationScoreDto: CreateApplicationScoreDto,
  ): Promise<UpdateResult> {
    await this.applicationScoreService.create(createApplicationScoreDto);
    const { scores, applicationId: id } = createApplicationScoreDto;
    const application = await this.findOne(id);
    const overallScore: number = scores.reduce(
      (total: number, current: number) => {
        return total + current;
      },
      0,
    );

    const averageScore = Math.round((overallScore / scores.length) * 100) / 100;
    const scoringSystem = await this.scoringSystemService.determinePlaceByScore(
      averageScore,
      application.festival.type,
    );
    application.place = { id: scoringSystem.id } as ScoringSystem;
    application.totalScore = overallScore;
    return this.applicationRepository.update({ id }, application);
  }
}
