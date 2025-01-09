import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFestivalTypeDto } from './dto/create-festival-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FestivalType } from './entities/festival-type.entity';
import { FestivalsEnum } from '../festivals/festivals.service';
import { Festival } from '../festivals/entities/festival.entity';
import { LanguageService } from '../translations/language.service';
import { TextContentService } from '../translations/text-content.service';

@Injectable()
export class FestivalTypesService {
  constructor(
    @InjectRepository(FestivalType)
    private festivalTypeRepository: Repository<FestivalType>,
    private languageService: LanguageService,
    private textContentService: TextContentService,
  ) {}

  async getByName(festivalName: FestivalsEnum): Promise<FestivalType> {
    return await this.festivalTypeRepository
      .createQueryBuilder('festivalType')
      .leftJoinAndSelect('festivalType.name', 'textContent')
      .leftJoinAndSelect('textContent.translations', 'translations')
      .where('translations.translation= :name', { name: festivalName })
      .select(['festivalType.id', 'textContent.id', 'translations.translation'])
      .getOne();
  }

  findAll() {
    return this.festivalTypeRepository.find();
  }

  findOne(id: number) {
    return this.festivalTypeRepository.findOneBy({ id });
  }
  async create(createFestivalTypeDto: CreateFestivalTypeDto) {
    try {
      const { name } = createFestivalTypeDto;
      await this.checkIfFestivalExists(
        name.translations[0].translation as FestivalsEnum,
      );
      const newFestivalType = new Festival();
      const languages = await this.languageService.getAllLanguages();
      newFestivalType.title = await this.textContentService.addTranslations(
        name.translations,
        languages,
      );
      return this.festivalTypeRepository.save(newFestivalType);
    } catch (error) {
      throw new Error(error);
    }
  }

  private async checkIfFestivalExists(name: FestivalsEnum) {
    const existingFestival = await this.getByName(name as FestivalsEnum);
    if (existingFestival) {
      return new BadRequestException(
        `The festival with name '${name}' already exists`,
      );
    }
  }

  remove(id: number) {
    return this.festivalTypeRepository.delete(id);
  }
}
