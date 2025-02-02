import { CreateApplicationDto } from './dto/create-application.dto';
import { Application } from './entities/application.entity';
import { ParticipantVideoLinksService } from '../participant-video-links/participant-video-links.service';
import {
  ParticipantsService,
  ParticipantType,
} from '../participants/participants.service';
import { ParticipantRecordingsService } from '../participant-recordings/participant-recordings.service';
import { ParticipantDocumentsService } from '../participant-documents/participant-documents.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from '../countries/entities/country.entity';
import { Repository, SelectQueryBuilder, UpdateResult } from 'typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
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
import { getOverallScore } from '../utils/getOverallScore';
import { getAverageScore } from '../utils/getAverageScore';

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
        countryId,
        leaderLastName,
        participantType,
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
      await this.checkIfApplicationExists(createApplicationDto, festivalId);
      application.isFree = !!isFree;
      application.leaderFirstName = leaderFirstName;
      application.leaderLastName = leaderLastName;
      application.participantType = participantType;
      application.isOnline = !!isOnline;
      application.email = email;
      application.phoneNumber = phoneNumber;
      application.participantDocuments =
        await this.participantDocumentsService.saveMany(uploadedImages);
      application.subNomination = { id: subNominationId } as SubNomination;
      application.country = { id: countryId } as Country;
      application.compositions =
        await this.applicationCompositionService.saveMany(
          applicationCompositions,
        );
      application.festival = { id: festival.id } as Festival;

      if (createApplicationDto.quantity) {
        application.quantity = quantity;
      }

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
    } catch (error) {
      throw error;
    }
  }

  checkIfFestivalIsExpired(festival: Festival) {
    if (!festival) {
      throw new BadRequestException('The festival is not found');
    }
    const currentDate = new Date();
    currentDate.setSeconds(0, 0);
    if (festival.applicationEndDate <= currentDate) {
      throw new BadRequestException('The festival is expired');
    }
  }

  async checkIfApplicationExists(
    createApplicationDto: CreateApplicationDto,
    festivalId: number,
  ) {
    let shouldRejectApplication: boolean;
    if (
      [ParticipantType.ENSEMBLE, ParticipantType.ORCHESTRA].includes(
        createApplicationDto.participantType as ParticipantType,
      )
    ) {
      shouldRejectApplication =
        await this.checkApplicationByLeader(createApplicationDto);
    } else {
      shouldRejectApplication = await this.checkApplicationByParticipants(
        createApplicationDto,
        festivalId,
      );
    }

    if (shouldRejectApplication) {
      throw new BadRequestException('Application already exists');
    }
  }

  async checkApplicationByLeader(
    createApplicationDto: CreateApplicationDto,
  ): Promise<boolean> {
    const participantType = createApplicationDto.isOrchestra
      ? ParticipantType.ORCHESTRA
      : ParticipantType.ENSEMBLE;
    const existingApplication = await this.applicationRepository
      .createQueryBuilder('application')
      .leftJoinAndSelect('application.subNomination', 'subNomination')
      .where('application.leaderFirstName = :leaderFirstName', {
        leaderFirstName: createApplicationDto.leaderFirstName,
      })
      .andWhere('application.leaderLastName = :leaderLastName', {
        leaderLastName: createApplicationDto.leaderLastName,
      })
      .andWhere('application.participantType = :participantType', {
        participantType,
      })
      .andWhere('subNomination.id = :subNominationId', {
        subNominationId: createApplicationDto.subNominationId,
      })
      .select()
      .getOne();

    if (existingApplication) {
      return true;
    }
  }

  async checkApplicationByParticipants(
    createApplicationDto: CreateApplicationDto,
    festivalId: number,
  ): Promise<boolean> {
    let shouldRejectApplication = false;
    const existingParticipant = await this.participantsService.getByFullData(
      createApplicationDto.participants[0],
    );

    if (!existingParticipant) {
      return shouldRejectApplication;
    }
    const participantApplications =
      await this.findActiveApplicationsByParticipantId(
        existingParticipant.id,
        festivalId,
        createApplicationDto,
      );
    if (!participantApplications.length) {
      return shouldRejectApplication;
    }
    participantApplications.map(async (participantApplication) => {
      if (participantApplication.participantType === ParticipantType.SOLO) {
        shouldRejectApplication = true;
        return;
      }

      const existingApplication =
        this.participantsService.compareParticipantsArrays(
          createApplicationDto.participants,
          await this.participantsService.getByApplicationId(
            participantApplication.id,
          ),
        );

      if (existingApplication) {
        shouldRejectApplication = true;
        return;
      }
    });

    return shouldRejectApplication;
  }

  async findActiveApplicationsByParticipantId(
    id: number,
    festivalId: number,
    createApplicationDto: CreateApplicationDto,
  ): Promise<Application[]> {
    return await this.applicationRepository
      .createQueryBuilder('application')
      .leftJoinAndSelect('application.participants', 'participants')
      .leftJoinAndSelect('application.festival', 'festival')
      .leftJoinAndSelect('application.subNomination', 'subNomination')
      .where('participants.id = :id', { id })
      .andWhere('festival.id = :festivalId', { festivalId })
      .andWhere('subNomination.id = :subNominationId', {
        subNominationId: createApplicationDto.subNominationId,
      })
      .select(['application.id', 'application.participantType'])
      .getMany();
  }

  selectQueryBuilder(): SelectQueryBuilder<Application> {
    return this.applicationRepository
      .createQueryBuilder('application')
      .leftJoinAndSelect('application.compositions', 'compositions')
      .leftJoinAndSelect('application.participants', 'participants')
      .leftJoinAndSelect('application.school', 'school')
      .leftJoinAndSelect('application.country', 'country')
      .leftJoinAndSelect('application.festival', 'festival')
      .leftJoinAndSelect('festival.type', 'festivalType')
      .leftJoinAndSelect('application.subNomination', 'subNomination')
      .leftJoinAndSelect('subNomination.name', 'subNominationTextContent')
      .leftJoinAndSelect(
        'subNominationTextContent.translations',
        'subNominationTranslations',
      )
      .leftJoinAndSelect(
        'subNominationTranslations.language',
        'subNominationTranslationsLanguage',
      )
      .leftJoinAndSelect(
        'application.participantDocuments',
        'participantDocuments',
      )
      .leftJoinAndSelect(
        'application.participantRecordings',
        'participantRecordings',
      )
      .leftJoinAndSelect(
        'application.participantVideoLinks',
        'participantVideoLinks',
      );
  }

  async findAll() {
    return await this.selectQueryBuilder().select().getMany();
  }

  async findOne(id: number) {
    return await this.selectQueryBuilder()
      .where('application.id= :id', { id })
      .select()
      .getOne();
  }

  async findByFestivalId(festivalId: number): Promise<Application[]> {
    return await this.selectQueryBuilder()
      .leftJoinAndSelect('school.name', 'schoolTextContent')
      .leftJoinAndSelect('schoolTextContent.translations', 'schoolTranslations')
      .leftJoinAndSelect(
        'schoolTranslations.language',
        'schoolTranslationsLanguage',
      )
      .leftJoinAndSelect('school.region', 'region')
      .leftJoinAndSelect('region.name', 'regionTextContent')
      .leftJoinAndSelect('regionTextContent.translations', 'regionTranslations')
      .leftJoinAndSelect(
        'regionTranslations.language',
        'regionTranslationsLanguage',
      )
      .leftJoinAndSelect('country.name', 'countryTextContent')
      .leftJoinAndSelect(
        'countryTextContent.translations',
        'countryTranslations',
      )
      .leftJoinAndSelect(
        'countryTranslations.language',
        'countryTranslationsLanguage',
      )
      .leftJoinAndSelect('subNomination.nomination', 'nomination')
      .leftJoinAndSelect('nomination.name', 'nominationTextContent')
      .leftJoinAndSelect(
        'nominationTextContent.translations',
        'nominationTranslations',
      )
      .leftJoinAndSelect(
        'nominationTranslations.language',
        'nominationTranslationsLanguage',
      )
      .where('festival.id= :festivalId', { festivalId })
      .orderBy('nomination.id')
      .select()
      .getMany();
  }

  async update(id: number, updateApplicationDto: UpdateApplicationDto) {}

  async addApplicationScore(
    createApplicationScoreDto: CreateApplicationScoreDto,
  ): Promise<UpdateResult> {
    await this.applicationScoreService.create(createApplicationScoreDto);
    const { scores, applicationId: id } = createApplicationScoreDto;
    const application: Application = await this.findOne(id);
    const overallScore: number = getOverallScore(scores);
    const averageScore: number = getAverageScore(overallScore, scores);
    const scoringSystem: ScoringSystem =
      await this.scoringSystemService.determinePlaceByScore(
        averageScore,
        application.festival.type,
      );
    application.place = { id: scoringSystem.id } as ScoringSystem;
    application.totalScore = overallScore;
    return this.applicationRepository.update({ id }, application);
  }
}
