import { Injectable } from '@nestjs/common';
import { CreateFestivalDto } from './dto/create-festival.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Festival } from './entities/festival.entity';
import { Language } from '../translations/entities/language.entity';
import { TextContent } from '../translations/entities/textContent.entity';
import { TranslationsService } from '../translations/translations.service';
import { TextContentService } from '../translations/text-content.service';
import { LanguageService } from '../translations/language.service';
import { FestivalTypesService } from '../festival-types/festival-types.service';

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
    private textContentService: TextContentService,
    private languageService: LanguageService,
    private festivalTypeService: FestivalTypesService,
  ) {}

  findAll() {
    return this.festivalRepository.find();
  }

  findOne(id: number) {
    return this.festivalRepository.findOneBy({ id });
  }

  findActiveByName(festivalName: FestivalsEnum): Promise<Festival> {
    return this.festivalRepository
      .createQueryBuilder('festival')
      .leftJoinAndSelect('festival.type', 'festivalType')
      .leftJoinAndSelect('festivalType.name', 'textContent')
      .where('festival.isActive = :isActive', { isActive: true })
      .andWhere('textContent = :name', { name: festivalName })
      .select(['festival.id'])
      .getOne();
  }
  async create(createFestivalDto: CreateFestivalDto) {
    try {
      const newFestival = new Festival();
      newFestival.type = await this.festivalTypeService.getByName(
          createFestivalDto.festivalType,
      );
      const languages = await this.languageService.getAllLanguages();
      const { name, description } = createFestivalDto;

      newFestival.isActive = createFestivalDto.isActive;
      newFestival.name = await this.textContentService.addTranslations(
          name.translations,
          languages,
      );
      newFestival.description = await this.textContentService.addTranslations(
          description.translations,
          languages,
      );
      await this.festivalRepository.save(newFestival);
    } catch (error) {
      throw new Error(error)
    }
  }

  remove(id: number) {
    return this.festivalRepository.delete(id);
  }
}
