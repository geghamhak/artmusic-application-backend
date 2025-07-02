import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFestivalDto } from './dto/create-festival.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Festival } from './entities/festival.entity';
import { TextContentService } from '../translations/text-content.service';
import {
  FestivalTypesEnum,
  FestivalTypesService,
} from '../festival-types/festival-types.service';
import { FestivalType } from '../festival-types/entities/festival-type.entity';
import { UpdateFestivalDto } from './dto/update-festival.dto';
import { FestivalImagesService } from '../festival-images/festival-images.service';
import { DmsService } from '../dms/dms.service';
import { FileSystemStoredFile } from 'nestjs-form-data';
import { ExcelService } from '../excel/excel.service';
import { formatStringToDate } from 'src/utils/stringUtils';
import {
  FestivalConfigService,
  ShouldUpdateFestival,
} from '../festival-config/festival-config.service';
import {
  CentralizedPlaces,
  CentralizedScoringPattern,
  CreateScoringItem,
} from '../scoring-system/scoring-system.service';

@Injectable()
export class FestivalsService {
  constructor(
    @InjectRepository(Festival)
    private festivalRepository: Repository<Festival>,
    private dmsService: DmsService,
    private textContentService: TextContentService,
    private festivalTypeService: FestivalTypesService,
    @Inject(forwardRef(() => FestivalImagesService))
    private festivalImagesService: FestivalImagesService,
    private excelService: ExcelService,
    private festivalConfigService: FestivalConfigService,
  ) {}

  findAll() {
    return this.festivalRepository.find();
  }

  async findOne(id: number) {
    const festival = await this.festivalRepository
      .createQueryBuilder('festival')
      .leftJoinAndSelect('festival.title', 'title')
      .leftJoinAndSelect('festival.type', 'festivalType')
      .leftJoinAndSelect('title.translations', 'titleTranslations')
      .leftJoinAndSelect('titleTranslations.language', 'titleLanguage')

      .leftJoinAndSelect('festival.description', 'description')
      .leftJoinAndSelect('description.translations', 'descriptionTranslations')
      .leftJoinAndSelect(
        'descriptionTranslations.language',
        'descriptionLanguage',
      )

      .leftJoinAndSelect('festival.bannerDescription', 'bannerDescription')
      .leftJoinAndSelect('bannerDescription.translations', 'bannerTranslations')
      .leftJoinAndSelect('bannerTranslations.language', 'bannerLanguage')
      .leftJoinAndSelect('festival.config', 'config')

      .where('festival.id = :id', { id })
      .select([
        'festival.id',
        'festival.applicationStartDate',
        'festival.applicationEndDate',
        'festivalType.key',

        'title.id',
        'titleTranslations.id',
        'titleTranslations.translation',
        'titleLanguage.code',

        'description.id',
        'descriptionTranslations.id',
        'descriptionTranslations.translation',
        'descriptionLanguage.code',

        'bannerDescription.id',
        'bannerTranslations.id',
        'bannerTranslations.translation',
        'bannerLanguage.code',
        'config.secondComposition',
        'config.thirdComposition',
        'config.isOnline',
      ])
      .getOne();

    if (!festival) {
      throw new NotFoundException(`Festival with id ${id} not found`);
    }

    const banner = await this.dmsService.getPreSignedUrls(
      `festivals/${id}/banner/`,
    );
    const termsAndConditions = await this.dmsService.getPreSignedUrls(
      `festivals/${id}/termsAndConditions/`,
    );
    const gallery = await this.dmsService.getPreSignedUrls(
      `festivals/${id}/gallery/`,
    );

    const config = this.festivalConfigService.mapFestivalConfigs(
      festival.config,
      festival.type.key as FestivalTypesEnum,
    );

    return {
      id: festival.id,
      applicationStartDate: festival.applicationStartDate,
      applicationEndDate: festival.applicationEndDate,
      title: festival.title.translations.map((t) => ({
        translation: t.translation,
        languageCode: t.language.code,
      })),
      description: festival.description.translations.map((t) => ({
        translation: t.translation,
        languageCode: t.language.code,
      })),
      bannerDescription: festival.bannerDescription.translations.map((t) => ({
        translation: t.translation,
        languageCode: t.language.code,
      })),
      banner,
      termsAndConditions,
      gallery,
      config,
    } as unknown as Festival;
  }

  async findActiveByName(festivalName: FestivalTypesEnum) {
    const currentDate = new Date();
    currentDate.toISOString();
    const activeFestival = await this.festivalRepository
      .createQueryBuilder('festival')
      .leftJoinAndSelect('festival.type', 'festivalType')
      .leftJoinAndSelect('festival.config', 'config')
      .where('festival.applicationStartDate <= :currentDate', { currentDate })
      .andWhere('festival.applicationEndDate >= :currentDate', { currentDate })
      .andWhere('festivalType.key= :key', { key: festivalName })
      .select()
      .getOne();

    if (!activeFestival) {
      throw new NotFoundException('The festival is not active');
    }
    const config = this.festivalConfigService.mapFestivalConfigs(
      activeFestival.config,
      activeFestival.type.key as FestivalTypesEnum,
    );
    return { ...activeFestival, config };
  }

  async findByType(festivalName: FestivalTypesEnum): Promise<Festival[]> {
    const festivalsData = await this.festivalRepository
      .createQueryBuilder('festival')
      .leftJoinAndSelect('festival.title', 'textContent')
      .leftJoinAndSelect('textContent.translations', 'translations')
      .leftJoinAndSelect('translations.language', 'language')
      .innerJoin('festival.type', 'festivalType')
      .where('festivalType.key = :key', { key: festivalName })
      .select([
        'festival.id',
        'textContent.id',
        'translations.id',
        'translations.translation',
        'language.code',
      ])
      .getMany();

    if (festivalsData && !festivalsData.length) {
      return [];
    }

    return festivalsData.map((festival) => {
      return {
        id: festival.id,
        title: {
          translations: festival.title.translations.map((translation) => ({
            languageCode: translation.language.code,
            translation: translation.translation,
          })),
        },
      } as unknown as Festival;
    });
  }

  async create(createFestivalDto: CreateFestivalDto) {
    let festivalId: number;
    try {
      const { applicationStartDate, applicationEndDate } = createFestivalDto;
      const festivalType = await this.festivalTypeService.getByKey(
        createFestivalDto.type,
      );
      const newFestival = new Festival();
      let applicationStartDateFormatted: Date;
      let applicationEndDateFormatted: Date;

      if (applicationStartDate && applicationEndDate) {
        applicationStartDateFormatted =
          formatStringToDate(applicationStartDate);
        applicationEndDateFormatted = formatStringToDate(applicationEndDate);
        await this.checkIfFestivalExists(
          applicationStartDateFormatted,
          applicationEndDateFormatted,
          festivalType,
        );
        newFestival.applicationStartDate = applicationStartDateFormatted;
        newFestival.applicationEndDate = applicationEndDateFormatted;
      }

      const {
        title,
        description,
        bannerDescription,
        banner,
        termsAndConditions,
        gallery,
        festivalStartDate,
        festivalEndDate,
        festivalConfig,
        scoringPattern,
      } = createFestivalDto;

      newFestival.type = { id: festivalType.id } as FestivalType;
      newFestival.title = await this.textContentService.addTranslations(title);
      newFestival.description =
        await this.textContentService.addTranslations(description);
      newFestival.bannerDescription =
        await this.textContentService.addTranslations(bannerDescription);
      if (festivalStartDate && festivalEndDate) {
        newFestival.festivalStartDate = formatStringToDate(festivalStartDate);
        newFestival.festivalEndDate = formatStringToDate(festivalEndDate);
      }
      if (festivalConfig) {
        newFestival.config =
          await this.festivalConfigService.create(festivalConfig);
      }
      this.setFestivalScoringPattern(newFestival, scoringPattern);
      const festival = await this.festivalRepository.save(newFestival);
      festivalId = festival.id;
      if (createFestivalDto.existingSchedule) {
        await this.addApplicationsFromSchedule(
          createFestivalDto.existingSchedule,
          festival.id,
        );
      }

      await this.dmsService.uploadSingleFile({
        file: banner,
        entity: 'festivals',
        entityId: festival.id,
        type: 'banner',
      });
      await this.dmsService.uploadSingleFile({
        file: termsAndConditions,
        entity: 'festivals',
        entityId: festival.id,
        type: 'termsAndConditions',
      });
      if (gallery) {
        await this.festivalImagesService.add(gallery, festival.id);
      }
    } catch (error) {
      if (festivalId) {
        await this.removeFestivalInfo(festivalId);
      }
      throw error;
    }
  }

  setFestivalScoringPattern(
    newFestival: Festival,
    scoringPattern?: CreateScoringItem[],
  ) {
    let festivalScoringPattern: Map<CentralizedPlaces, number[]>;
    if (!scoringPattern) {
      festivalScoringPattern = CentralizedScoringPattern;
    } else {
      festivalScoringPattern = new Map();
      scoringPattern.forEach((scoringItem) => {
        festivalScoringPattern.set(scoringItem.place, [
          scoringItem.minRange,
          scoringItem.maxRange,
        ]);
      });
    }

    newFestival.scorePattern = JSON.stringify(festivalScoringPattern);
  }

  async update(id: number, updateFestivalDto: UpdateFestivalDto) {
    try {
      const festival = await this.festivalRepository.findOne({
        where: { id },
        relations: ['title', 'description', 'bannerDescription', 'config'],
      });
      await this.updateFestivalTextData(festival, updateFestivalDto);
      await this.updateFestivalConfig(festival, updateFestivalDto);
      await this.updateFestivalDates(festival, updateFestivalDto);
      await this.updateFestivalImageData(festival, updateFestivalDto);
    } catch (error) {
      throw error;
    }
  }

  async updateFestivalTextData(
    festival: Festival,
    updateFestivalDto: UpdateFestivalDto,
  ) {
    const { title, description, bannerDescription } = updateFestivalDto;
    if (title?.length) {
      await this.textContentService.updateTranslations(festival.title, title);
    }

    if (description?.length) {
      await this.textContentService.updateTranslations(
        festival.description,
        description,
      );
    }

    if (bannerDescription?.length) {
      await this.textContentService.updateTranslations(
        festival.bannerDescription,
        bannerDescription,
      );
    }
  }
  async updateFestivalConfig(
    festival: Festival,
    updateFestivalDto: UpdateFestivalDto,
  ) {
    const { festivalConfig } = updateFestivalDto;

    if (!festivalConfig) {
      return;
    }
    const {
      shouldUpdate,
      festivalConfig: updatedConfig,
    }: ShouldUpdateFestival = await this.festivalConfigService.update(
      festival,
      festivalConfig,
    );
    if (shouldUpdate) {
      festival.config = updatedConfig;
      await this.festivalRepository.save(festival);
    }
  }

  async updateFestivalDates(
    festival: Festival,
    updateFestivalDto: UpdateFestivalDto,
  ) {
    const {
      applicationStartDate,
      applicationEndDate,
      festivalEndDate,
      festivalStartDate,
    } = updateFestivalDto;

    let updateRequired = false;

    if (applicationStartDate?.length) {
      festival.applicationStartDate = formatStringToDate(applicationStartDate);
      updateRequired = true;
    }

    if (applicationEndDate?.length) {
      festival.applicationEndDate = formatStringToDate(applicationEndDate);
      updateRequired = true;
    }

    if (festivalStartDate?.length) {
      festival.festivalStartDate = formatStringToDate(festivalStartDate);
      updateRequired = true;
    }

    if (festivalEndDate?.length) {
      festival.festivalEndDate = formatStringToDate(festivalEndDate);
      updateRequired = true;
    }

    if (updateRequired) {
      await this.festivalRepository.save(festival);
    }
  }

  async updateFestivalImageData(
    festival: Festival,
    updateFestivalDto: UpdateFestivalDto,
  ) {
    const {
      banner,
      bannerDeleted,
      termsAndConditions,
      gallery,
      galleryDeleted,
    } = updateFestivalDto;

    if (bannerDeleted?.length && banner) {
      await this.dmsService.deleteFile(bannerDeleted[0] as unknown as string);
      await this.dmsService.uploadSingleFile({
        file: banner,
        entity: 'festivals',
        entityId: festival.id,
        type: 'banner',
      });
    }

    if (termsAndConditions) {
      await this.dmsService.uploadSingleFile({
        file: termsAndConditions,
        entity: 'festivals',
        entityId: festival.id,
        type: 'termsAndConditions',
      });
    }

    if (galleryDeleted?.length) {
      await this.festivalImagesService.remove(festival.id, galleryDeleted);
    }

    if (gallery) {
      await this.festivalImagesService.add(gallery);
    }
  }

  remove(id: number) {
    return this.removeFestivalInfo(id);
  }

  async checkIfFestivalExists(
    applicationStartDate: Date,
    applicationEndDate: Date,
    festivalType: FestivalType,
  ) {
    if (!festivalType) {
      throw new BadRequestException(`Pleas provide correct festival type`);
    }
    const existingFestival = await this.festivalRepository
      .createQueryBuilder('festival')
      .leftJoinAndSelect('festival.type', 'festivalType')
      .where('festivalType.id = :typeId', { typeId: festivalType.id })
      .andWhere('festival.applicationStartDate = :startDate', {
        startDate: applicationStartDate,
      })
      .andWhere('festival.applicationEndDate = :endDate', {
        endDate: applicationEndDate,
      })
      .getOne();

    if (existingFestival) {
      throw new BadRequestException('Festival already exists');
    }
  }

  async removeFestivalInfo(id: number) {
    try {
      console.log(`Removing festival info for ${id}`);
      const festival = await this.festivalRepository
        .createQueryBuilder('festival')
        .leftJoinAndSelect('festival.title', 'titleTextContent')
        .leftJoinAndSelect('festival.description', 'descriptionTextContent')
        .leftJoinAndSelect('festival.applications', 'applications')
        .leftJoinAndSelect(
          'festival.bannerDescription',
          'bannerDescriptionTextContent',
        )
        .where('festival.id = :id', { id })
        .select([
          'festival.id',
          'titleTextContent.id',
          'descriptionTextContent.id',
          'bannerDescriptionTextContent.id',
        ])
        .getOne();

      const { title, description, bannerDescription } = festival;

      await this.festivalRepository.remove(festival);
      await this.textContentService.deleteByIds([
        title.id,
        description.id,
        bannerDescription.id,
      ]);
    } catch (error) {
      throw error;
    }
  }

  async addApplicationsFromSchedule(
    existingSchedule: FileSystemStoredFile,
    festivalId: number,
  ) {
    try {
      await this.excelService.addApplicationsFromSchedule(
        existingSchedule,
        festivalId,
      );
    } catch (error) {
      throw new Error('Unable to proceed .xlsx file');
    }
  }
}
