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
  CentralizedPlaces,
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
import { Translation } from '../translations/entities/translation.entity';
import { ApplicationComposition } from '../application-composition/entities/application-composition.entity';

export interface IFestivalApplication {
  id: number;
  code: number;
  country: Translation[];
  subNomination: Translation[];
  nomination: Translation[];
  subNominationId: number;
  nominationId: number;
  region: Translation[] | string;
  school: Translation[] | string;
  isFree: number;
  isOnline: number;
  leaderFirstName: string;
  leaderLastName: string;
  quantity: number;
  performanceDate: string;
  performanceTime: string;
  participantType: string;
  compositions: ApplicationComposition[];
  participants: {
    firstName: Translation[];
    lastName: Translation[];
    fatherName: Translation[];
  }[];
  email: string;
  phoneNumber: string;
  totalDuration: string;
  overallScore?: number;
  totalScore?: number;
  place?: string;
}

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
      application.isFree = JSON.parse(isFree) === true ? 1 : 0;
      application.leaderFirstName = leaderFirstName;
      application.leaderLastName = leaderLastName;
      application.participantType = participantType;
      application.isOnline = JSON.parse(isOnline) === true ? 1 : 0;
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
      application.isFree = JSON.parse(isFree) === true ? 1 : 0;
      application.isOnline = 0;
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
      .leftJoinAndSelect('country.name', 'countryTextContent')
      .leftJoinAndSelect(
        'countryTextContent.translations',
        'countryTranslations',
      )
      .leftJoinAndSelect('subNomination.nomination', 'nomination')
      .leftJoinAndSelect('nomination.name', 'nominationTextContent')
      .leftJoinAndSelect(
        'nominationTextContent.translations',
        'nominationTranslations',
      )
      .leftJoinAndSelect('participants.firstName', 'firstNameTextContent')
      .leftJoinAndSelect(
        'firstNameTextContent.translations',
        'firstNameTranslations',
      )
      .leftJoinAndSelect('participants.lastName', 'lastNameTextContent')
      .leftJoinAndSelect(
        'lastNameTextContent.translations',
        'lastNameTranslations',
      )
      .leftJoinAndSelect('participants.fatherName', 'fatherNameTextContent')
      .leftJoinAndSelect(
        'fatherNameTextContent.translations',
        'fatherNameTranslations',
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
    const scorePattern = await this.festivalService.findFestivalScorePattern(
      application.festival.id,
    );
    application.place =
      this.scoringSystemService.determinePlaceByCentralizedSystem(
        averageScore,
        scorePattern,
      );
    return await this.applicationRepository.save(application);
  }

  async addApplicationScore(
    createApplicationScoreDto: CreateApplicationScoreDto,
  ): Promise<Application> {
    await this.applicationScoreService.create(createApplicationScoreDto);
    const { scores, applicationId, isGrandPrix } = createApplicationScoreDto;
    const application = await this.applicationRepository.findOneBy({
      id: applicationId,
    });
    const overallScore: number = getOverallScore(scores);
    const averageScore: number = getAverageScore(overallScore, scores);

    if (isGrandPrix) {
      application.place = CentralizedPlaces.GRAND;
    } else {
      const scorePattern = await this.festivalService.findFestivalScorePattern(
        application.festival.id,
      );
      application.place =
        this.scoringSystemService.determinePlaceByCentralizedSystem(
          averageScore,
          scorePattern,
        );
    }
    application.totalScore = overallScore;
    application.averageScore = averageScore;
    return await this.applicationRepository.save(application);
  }

  async findAndRearrangeDataForFestival(
    festivalId: number,
  ): Promise<IFestivalApplication[]> {
    const applications = await this.findByFestivalId(festivalId);
    return applications.map((application) => {

      return {
        id: application.id,
        code: application.code,
        country: application.country.name.translations,
        subNomination: application.subNomination.name.translations,
        nomination: application.subNomination.nomination.name.translations,
        subNominationId: application?.subNomination?.id,
        nominationId: application?.nomination?.id,
        region: application.school.region
          ? application.school.region.name.translations
          : application.regionName,
        school: application.school
          ? application.school.name.translations
          : application.schoolName,
        isFree: application.isFree,
        isOnline: application.isOnline,
        leaderFirstName: application.leaderFirstName,
        leaderLastName: application.leaderLastName,
        quantity: application.quantity,
        performanceDate: application.performanceDate,
        performanceTime: application.performanceTime,
        participantType: application.participantType,
        compositions: application.compositions,
        participants: application.participants
          ? application.participants.map((participant) => {
              return {
                firstName: participant.firstName.translations,
                lastName: participant.lastName.translations,
                ...(participant.fatherName && {
                  fatherName: participant.fatherName.translations,
                }),
              };
            })
          : [],
        email: application.email,
        phoneNumber: application.phoneNumber,
        totalDuration: application.totalDuration,
      };
    });
  }
}
