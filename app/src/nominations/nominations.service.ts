import { Injectable } from '@nestjs/common';
import { CreateNominationDto } from './dto/create-nomination.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Nomination } from './entities/nomination.entity';
import { TranslationsService } from '../translations/translations.service';
import { INominationResponse } from './interfaces/INominationResponse';

@Injectable()
export class NominationsService {
  constructor(
    @InjectRepository(Nomination)
    private nominationRepository: Repository<Nomination>,
    private translationService: TranslationsService,
  ) {}

  async findAll(): Promise<INominationResponse[]> {
    const nominations = await this.nominationRepository
      .createQueryBuilder('nomination')
      .leftJoinAndSelect('nomination.name', 'textContent')
      .leftJoinAndSelect('textContent.translations', 'translations')
      .leftJoinAndSelect('translations.language', 'translationLanguage')
      .select([
        'nomination.id',
        'textContent.id',
        'translations.translation',
        'translationLanguage.code',
      ])
      .getMany();

    return this.translationService.mapTranslations(nominations);
  }

  findOne(id: number) {
    return this.nominationRepository.findOneBy({ id });
  }
  create(createNominationDto: CreateNominationDto) {
    return this.nominationRepository.create(createNominationDto);
  }

  remove(id: number) {
    return this.nominationRepository.delete(id);
  }
}
