import { Injectable } from '@nestjs/common';
import { CreateSubNominationDto } from './dto/create-sub-nomination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubNomination } from './entities/sub-nomination.entity';
import { TranslationsService } from '../translations/translations.service';
import { ISubNominationResponse } from './interfaces/ISubNominationResponse';

@Injectable()
export class SubNominationsService {
  constructor(
    @InjectRepository(SubNomination)
    private subNominationRepository: Repository<SubNomination>,
    private translationService: TranslationsService,
  ) {}

  async findAll(): Promise<ISubNominationResponse[]> {
    const subNominations = await this.subNominationRepository
      .createQueryBuilder('sub_nomination')
      .leftJoinAndSelect('sub_nomination.name', 'textContent')
      .leftJoinAndSelect('sub_nomination.nomination', 'nomination')
      .leftJoinAndSelect('textContent.translations', 'translations')
      .leftJoinAndSelect('translations.language', 'translationLanguage')
      .select([
        'sub_nomination.id',
        'sub_nomination.priority',
        'nomination.priority',
        'nomination.key',
        'nomination.id',
        'textContent.id',
        'translations.translation',
        'translationLanguage.code',
      ])
      .orderBy({
        'nomination.priority': 'ASC',
        'sub_nomination.priority': 'ASC',
      })
      .getMany();

    const mappedSubNominations: ISubNominationResponse[] =
      this.translationService.mapTranslations(subNominations);
    mappedSubNominations.forEach((mappedSubNomination) => {
      mappedSubNomination.nominationId = subNominations.find(
        (subNomination) => subNomination.id === mappedSubNomination.id,
      ).nomination.id;
      mappedSubNomination.nominationKey = subNominations.find(
        (subNomination) => subNomination.id === mappedSubNomination.id,
      ).nomination.key;
    });

    return mappedSubNominations as ISubNominationResponse[];
  }

  findOne(id: number) {
    return this.subNominationRepository.findOneBy({ id });
  }
  create(createSubNominationDto: CreateSubNominationDto) {
    return this.subNominationRepository.create(createSubNominationDto);
  }

  remove(id: number) {
    return this.subNominationRepository.delete(id);
  }

  async findByName(subNomination: string, languageCode: string) {
    return await this.subNominationRepository
      .createQueryBuilder('sub_nomination')
      .leftJoinAndSelect('sub_nomination.name', 'textContent')
      .leftJoinAndSelect('sub_nomination.nomination', 'nomination')
      .leftJoinAndSelect('textContent.translations', 'translations')
      .leftJoinAndSelect('translations.language', 'translationLanguage')
      .where('translations.translation = :subNomination', {
        subNomination,
      })
      .andWhere('translationLanguage.code = :languageCode', {
        languageCode,
      })
      .select(['sub_nomination.id', 'nomination.id'])
      .getOne();
  }
}
