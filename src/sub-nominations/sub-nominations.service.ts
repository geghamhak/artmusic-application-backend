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
      .leftJoinAndSelect('textContent.originalLanguage', 'language')
      .leftJoinAndSelect('textContent.translations', 'translations')
      .leftJoinAndSelect('translations.language', 'translationLanguage')
      .select([
        'sub_nomination.id',
        'nomination.id',
        'textContent.originalText',
        'language.code',
        'translations.translation',
        'translationLanguage.code',
      ])
      .getMany();

    const mappedSubNominations: ISubNominationResponse[] =
      this.translationService.mapTranslations(subNominations);
    mappedSubNominations.forEach((mappedSubNomination) => {
      mappedSubNomination.nominationId = subNominations.find(
        (subNomination) => subNomination.id === mappedSubNomination.id,
      ).nomination.id;
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
}
