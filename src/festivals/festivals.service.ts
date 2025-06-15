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
import { LanguageService } from '../translations/language.service';
import { FestivalTypesService } from '../festival-types/festival-types.service';
import { FestivalType } from '../festival-types/entities/festival-type.entity';
import { UpdateFestivalDto } from './dto/update-festival.dto';
import { DmsService } from 'src/dms/dms.service';
import { FestivalImagesService } from '../festival-images/festival-images.service';

export enum FestivalsEnum {
  ARTMUSIC = 'artmusic',
  MELODY = 'melody',
  NEW_HANDS = 'new_hands',
  LYRICS = 'lyrics',
  ART_PIANO = 'art_piano',
  KHACHATUR_AVETISYAN = 'khachatur_avetisyan',
  FOREIGN = 'foreign',
}
@Injectable()
export class FestivalsService {
  constructor(
    @InjectRepository(Festival)
    private festivalRepository: Repository<Festival>,
    private dmsService: DmsService,
    private textContentService: TextContentService,
    private languageService: LanguageService,
    private festivalTypeService: FestivalTypesService,
    @Inject(forwardRef(() => FestivalImagesService))
    private festivalImagesService: FestivalImagesService,
  ) {}

  findAll() {
    return this.festivalRepository.find();
  }

  async findOne(id: number) {
    const festival = await this.festivalRepository
      .createQueryBuilder('festival')
      .leftJoinAndSelect('festival.title', 'title')
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

      .where('festival.id = :id', { id })
      .select([
        'festival.id',
        'festival.applicationStartDate',
        'festival.applicationEndDate',

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
    } as unknown as Festival;
  }

  async findActiveByName(festivalName: FestivalsEnum): Promise<Festival> {
    const currentDate = new Date();
    currentDate.toISOString();
    const activeFestival = await this.festivalRepository
      .createQueryBuilder('festival')
      .leftJoinAndSelect('festival.type', 'festivalType')
      .where('festival.applicationStartDate <= :currentDate', { currentDate })
      .andWhere('festival.applicationEndDate >= :currentDate', { currentDate })
      .andWhere('festivalType.key= :key', { key: festivalName })
      .select()
      .getOne();
    if (!activeFestival) {
      throw new NotFoundException('The festival is not active');
    }
    return activeFestival;
  }

  async findByType(festivalName: FestivalsEnum): Promise<Festival[]> {
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

    if (!festivalsData.length) return [];

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
    try {
      const { applicationStartDate, applicationEndDate } = createFestivalDto;
      const startDate = new Date(applicationStartDate);
      startDate.setSeconds(0, 0);
      startDate.toISOString();
      const endDate = new Date(applicationEndDate);
      endDate.setSeconds(0, 0);
      endDate.toISOString();
      const festivalType = await this.festivalTypeService.getByKey(
        createFestivalDto.type,
      );
      await this.checkIfFestivalExists(startDate, endDate, festivalType);
      const newFestival = new Festival();
      newFestival.applicationStartDate = startDate;
      newFestival.applicationEndDate = endDate;
      const {
        title,
        description,
        bannerDescription,
        banner,
        termsAndConditions,
        gallery,
      } = createFestivalDto;
      newFestival.type = { id: festivalType.id } as FestivalType;
      const languages = await this.languageService.getAllLanguages();
      newFestival.title = await this.textContentService.addTranslations(
        title,
        languages,
      );
      newFestival.description = await this.textContentService.addTranslations(
        description,
        languages,
      );
      newFestival.bannerDescription =
        await this.textContentService.addTranslations(
          bannerDescription,
          languages,
        );
      const festival = await this.festivalRepository.save(newFestival);

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
      throw error;
    }
  }

  async update(id: number, updateFestivalDto: UpdateFestivalDto) {
    try {
      const festival = await this.festivalRepository.findOne({
        where: { id },
        relations: ['title', 'description', 'bannerDescription'],
      });
      const {
        title,
        description,
        bannerDescription,
        applicationStartDate,
        applicationEndDate,
        banner,
        bannerDeleted,
        termsAndConditions,
        gallery,
        galleryDeleted,
      } = updateFestivalDto;

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

      if (applicationStartDate?.length) {
        await this.festivalRepository.update(festival.id, {
          applicationStartDate,
        });
      }

      if (applicationEndDate?.length) {
        await this.festivalRepository.update(festival.id, {
          applicationEndDate,
        });
      }

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
        await this.festivalImagesService.remove(galleryDeleted);
      }

      if (gallery) {
        await this.festivalImagesService.add(gallery);
      }
    } catch (error) {
      throw error;
    }
  }

  remove(id: number) {
    return this.festivalRepository.delete(id);
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
}
