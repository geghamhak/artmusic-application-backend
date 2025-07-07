import {
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
import { FestivalConfigService } from '../festival-config/festival-config.service';
import {
  CentralizedPlaces,
  CentralizedScoringPattern,
  CreateScoringItem,
} from '../scoring-system/scoring-system.service';
import { FestivalQueriesService } from './festival.queries.service';
import { FestivalsGlobalConfig } from '../festival-config/types';

export interface IFestivalJuries {
  festivalId: number;
  nominationId?: number;
  subNominationI?: number;
  juriesIds: number[];
}

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
    private festivalQueriesService: FestivalQueriesService,
  ) {}

  findAll() {
    return this.festivalRepository.find();
  }

  async findOne(id: number) {
    const festival = await this.festivalQueriesService.findOne(id);

    if (!festival) {
      throw new NotFoundException(`Festival with id ${id} not found`);
    }

    const { banner, termsAndConditions, gallery } =
      await this.retrieveFestivalDocs(id);

    return {
      id: festival.id,
      applicationStartDate: festival.applicationStartDate,
      applicationEndDate: festival.applicationEndDate,
      festivalStartDate: festival.festivalStartDate,
      festivalEndDate: festival.festivalEndDate,
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
      config: this.festivalConfigService.mapFestivalConfigs(
        festival.config,
        festival.type.key as FestivalTypesEnum,
      ),
      scorePattern: Object.keys(festival.scorePattern).length
        ? festival.scorePattern
        : CentralizedScoringPattern,
    } as unknown as Festival;
  }

  async retrieveFestivalDocs(id: number) {
    const [banner, termsAndConditions, gallery] = await Promise.all([
      this.dmsService.getPreSignedUrls(`festivals/${id}/banner/`),
      this.dmsService.getPreSignedUrls(`festivals/${id}/termsAndConditions/`),
      this.dmsService.getPreSignedUrls(`festivals/${id}/gallery/`),
    ]);

    return { banner, termsAndConditions, gallery };
  }

  async findActiveByKey(festivalName: FestivalTypesEnum) {
    const activeFestival =
      await this.festivalQueriesService.findActiveByKey(festivalName);

    if (!activeFestival) {
      throw new NotFoundException('The festival is not active');
    }

    if (!Object.keys(activeFestival.scorePattern).length) {
      activeFestival.scorePattern = JSON.stringify(CentralizedScoringPattern);
    }
    const config = this.festivalConfigService.mapFestivalConfigs(
      activeFestival.config,
      activeFestival.type.key as FestivalTypesEnum,
    );
    return { ...activeFestival, config };
  }

  async findByType(festivalType: FestivalTypesEnum): Promise<Festival[]> {
    const festivalsData =
      await this.festivalQueriesService.findByType(festivalType);

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
        await this.festivalQueriesService.checkIfFestivalExists(
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
        config,
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
      if (config) {
        newFestival.config = await this.festivalConfigService.create(config);
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
    let festivalScoringPattern: {};
    if (!scoringPattern) {
      festivalScoringPattern = CentralizedScoringPattern;
    } else {
      festivalScoringPattern = {};
      scoringPattern.forEach((scoringItem) => {
        festivalScoringPattern[scoringItem.place as CentralizedPlaces] = [
          scoringItem.minRange,
          scoringItem.maxRange,
        ];
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
      if (updateFestivalDto.existingSchedule) {
        await this.addApplicationsFromSchedule(
          updateFestivalDto.existingSchedule,
          festival.id,
        );
      }
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
    const { config } = updateFestivalDto;
    if (!config) {
      return;
    }

    festival.config = await this.festivalConfigService.update(festival, config);
    await this.festivalRepository.save(festival);
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

  async removeFestivalInfo(id: number) {
    try {
      console.log(`Removing festival info for ${id}`);
      const festival =
        await this.festivalQueriesService.findFestivalToRemove(id);

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

  findConfigByType(type: FestivalTypesEnum) {
    return {
      config: FestivalsGlobalConfig[type],
      scorePattern: CentralizedScoringPattern,
    };
  }
}
