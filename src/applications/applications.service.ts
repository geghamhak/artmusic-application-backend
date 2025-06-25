import { CreateApplicationDto } from './dto/create-application.dto';
import { Application } from './entities/application.entity';
import { ParticipantVideoLinksService } from '../participant-video-links/participant-video-links.service';
import {
  ParticipantsService,
  ParticipantTypeEnum,
} from '../participants/participants.service';
import { ParticipantRecordingsService } from '../participant-recordings/participant-recordings.service';
import { ParticipantDocumentsService } from '../participant-documents/participant-documents.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from '../countries/entities/country.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { School } from '../schools/entities/school.entity';
import { Region } from '../regions/entities/region.entity';
import {
  ScoringSystemService,
} from '../scoring-system/scoring-system.service';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { SubNomination } from '../sub-nominations/entities/sub-nomination.entity';
import { ApplicationScoreService } from '../application-score/application-score.service';
import { FestivalsService } from '../festivals/festivals.service';
import { CreateApplicationScoreDto } from '../application-score/dto/create-application-score.dto';
import { ApplicationCompositionService } from '../application-composition/application-composition.service';
import { Festival } from '../festivals/entities/festival.entity';
import { getOverallScore } from '../utils/getOverallScore';
import { getAverageScore } from '../utils/getAverageScore';
import { SubNominationsService } from '../sub-nominations/sub-nominations.service';
import { NominationsService } from '../nominations/nominations.service';
import { Nomination } from '../nominations/entities/nomination.entity';
import { CountriesService } from '../countries/countries.service';
import { SchoolsService } from '../schools/schools.service';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
    @Inject(forwardRef(() => FestivalsService))
    private festivalService: FestivalsService,
    private participantVideoLinksService: ParticipantVideoLinksService,
    private participantsService: ParticipantsService,
    private participantRecordingsService: ParticipantRecordingsService,
    private participantDocumentsService: ParticipantDocumentsService,
    private scoringSystemService: ScoringSystemService,
    private applicationScoreService: ApplicationScoreService,
    private applicationCompositionService: ApplicationCompositionService,
    private subNominationService: SubNominationsService,
    private nominationService: NominationsService,
    private countryService: CountriesService,
    private schoolService: SchoolsService,
  ) {}
  async create(createApplicationDto: CreateApplicationDto) {
    try {
      const {
        isFree,
        countryId,
        leaderFirstName,
        participants,
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
        languageCode,
      } = createApplicationDto;
      const festival = await this.festivalService.findOne(festivalId);
      this.checkIfFestivalIsExpired(festival);
      await this.checkIfApplicationExists(
        createApplicationDto,
        festivalId,
        languageCode,
      );
      const application = new Application();
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
        application.participants = await this.participantsService.saveMany(
          participants,
          festivalId,
          languageCode,
        );
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

      // email queue
      // await this.emailQueueService.sendMessage({
      //   type: TemplateTypeEnum.EmailConfirmation,
      //   subject: 'Your application have been successfully received',
      //   emailsTo: [application.email],
      //   languageCode,
      // });
    } catch (error) {
      throw error;
    }
  }

  async addFromSchedule(
    createApplicationDto: Partial<CreateApplicationDto>,
    festivalId: number,
  ) {
    try {
      const {
        leaderFirstName,
        participants,
        leaderLastName,
        participantType,
        quantity,
        region,
        school,
        uploadedAudio,
        totalDuration,
        applicationCompositions,
        languageCode,
        subNomination,
        nomination,
        overallScore,
        averageScore,
        isFree,
      } = createApplicationDto;
      const festival = await this.festivalService.findOne(festivalId);
      await this.checkIfApplicationExists(
        createApplicationDto,
        festivalId,
        languageCode,
      );
      const application = new Application();
      application.leaderFirstName = leaderFirstName;
      application.leaderLastName = leaderLastName;
      application.participantType = participantType;
      const applicationSubNomination =
        await this.subNominationService.findByName(subNomination, languageCode);
      if (applicationSubNomination) {
        application.subNomination = {
          id: applicationSubNomination.id,
        } as SubNomination;
        application.nomination = {
          id: applicationSubNomination.nomination.id,
        } as Nomination;
      } else {
        const applicationNomination = await this.nominationService.findByName(
          nomination,
          languageCode,
        );
        application.nomination = { id: applicationNomination.id } as Nomination;
      }
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

      if (participants && participants.length > 0) {
        application.participants = await this.participantsService.saveMany(
          participants,
          festivalId,
          languageCode,
        );
      }

      if (uploadedAudio && uploadedAudio.length > 0) {
        application.participantRecordings =
          await this.participantRecordingsService.saveMany(uploadedAudio);
      }

      const applicationSchool = await this.schoolService.findByName(
        school,
        languageCode,
      );

      if (applicationSchool) {
        application.school = { id: applicationSchool.id } as School;
        application.region = { id: applicationSchool.region.id } as Region;
        const applicationCountry = await this.countryService.findByName(
          'Armenia',
          'en',
        );
        application.country = { id: applicationCountry.id } as Country;
      } else {
        application.schoolName = school;
        application.regionName = region;
      }
      application.isFree = !!isFree;
      application.isOnline = false;
      console.log(averageScore);
      console.log(overallScore);
      await this.addOverallScore(overallScore, averageScore, application);
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
    createApplicationDto: Partial<CreateApplicationDto>,
    festivalId: number,
    languageCode: string,
  ) {
    let shouldRejectApplication: boolean;
    if (
      [ParticipantTypeEnum.ENSEMBLE, ParticipantTypeEnum.ORCHESTRA].includes(
        createApplicationDto.participantType as ParticipantTypeEnum,
      )
    ) {
      shouldRejectApplication =
        await this.checkApplicationByLeader(createApplicationDto);
    } else {
      shouldRejectApplication = await this.checkApplicationByParticipants(
        createApplicationDto,
        festivalId,
        languageCode,
      );
    }

    if (shouldRejectApplication) {
      throw new BadRequestException('Application already exists');
    }
  }

  async checkApplicationByLeader(
    createApplicationDto: Partial<CreateApplicationDto>,
  ): Promise<boolean> {
    const participantType = createApplicationDto.isOrchestra
      ? ParticipantTypeEnum.ORCHESTRA
      : ParticipantTypeEnum.ENSEMBLE;
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
    createApplicationDto: Partial<CreateApplicationDto>,
    festivalId: number,
    languageCode: string,
  ): Promise<boolean> {
    let shouldRejectApplication = false;
    const existingParticipant = await this.participantsService.getByFullData(
      createApplicationDto.participants[0],
      festivalId,
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
      if (
        participantApplication.participantType.toUpperCase() ===
        ParticipantTypeEnum.SOLO
      ) {
        shouldRejectApplication = true;
        return;
      }

      const existingApplication =
        this.participantsService.compareParticipantsArrays(
          createApplicationDto.participants,
          await this.participantsService.getByApplicationId(
            participantApplication.id,
            languageCode,
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
    createApplicationDto: Partial<CreateApplicationDto>,
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
      .addOrderBy('application.participantType')
      .addOrderBy('participants.birthYear', 'DESC')
      .addOrderBy('participants.lastName')
      .addOrderBy('participants.firstName')
      .addOrderBy('participants.fatherName')
      .select()
      .getMany();
  }

  async getByFestivalIdAndCode(
    festivalId: number,
    code: string,
  ): Promise<Application> {
    return await this.applicationRepository
      .createQueryBuilder('application')
      .where('application.festivalId = :festivalId', { festivalId })
      .andWhere('application.code = :code', {
        code,
      })
      .getOne();
  }

  async update(id: number, updateApplicationDto: UpdateApplicationDto) {}

  async remove(id: number) {
    try {
      await this.applicationRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }

  async addOverallScore(
    overallScore: number,
    averageScore: number,
    application: Application,
  ) {
    application.totalScore = overallScore;
    application.averageScore = averageScore;
    application.place =
      this.scoringSystemService.determinePlaceByCentralizedSystem(averageScore);
    return await this.applicationRepository.save(application);
  }

  async addApplicationScore(
    createApplicationScoreDto: CreateApplicationScoreDto,
    application: Application,
  ): Promise<Application> {
    await this.applicationScoreService.create(
      createApplicationScoreDto,
      application.id,
    );
    const { scores } = createApplicationScoreDto;
    const overallScore: number = getOverallScore(scores);
    const averageScore: number = getAverageScore(overallScore, scores);
    application.place =
      this.scoringSystemService.determinePlaceByCentralizedSystem(averageScore);
    application.totalScore = overallScore;
    application.averageScore = averageScore;
    return await this.applicationRepository.save(application);
  }
}
