import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Festival } from './entities/festival.entity';
import { FestivalType } from '../festival-types/entities/festival-type.entity';

@Injectable()
export class FestivalQueriesService {
  constructor(
    @InjectRepository(Festival)
    private festivalRepository: Repository<Festival>,
  ) {}

  async findOne(id: number) {
    const festival = await this.festivalRepository
      .createQueryBuilder('festival')
      .leftJoinAndSelect('festival.type', 'festivalType')
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
      .leftJoinAndSelect('festival.config', 'config')

      .where('festival.id = :id', { id })
      .select([
        'festival.id',
        'festival.applicationStartDate',
        'festival.applicationEndDate',
        'festival.festivalStartDate',
        'festival.festivalEndDate',
        'festivalType.key',
        'festival.scorePattern',
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
        'config.id',
        'config.secondComposition',
        'config.thirdComposition',
        'config.isOnline',
      ])
      .getOne();

    if (!festival) {
      throw new NotFoundException(`Festival with id ${id} not found`);
    }

    return festival;
  }

  async findActiveByKey(festivalName: string) {
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

    return activeFestival;
  }

  async findByType(festivalName: string): Promise<Festival[]> {
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

    return festivalsData;
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

  async findFestivalToRemove(id: number) {
    return await this.festivalRepository
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
  }
}
