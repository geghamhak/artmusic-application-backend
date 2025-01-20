import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFestivalDto } from './dto/create-festival.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Festival } from './entities/festival.entity';
import { TextContentService } from '../translations/text-content.service';
import { LanguageService } from '../translations/language.service';
import { FestivalTypesService } from '../festival-types/festival-types.service';
import { FestivalType } from '../festival-types/entities/festival-type.entity';

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
      const { title, description, bannerDescription } = createFestivalDto;
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
      await this.festivalRepository.save(newFestival);
    } catch (error) {
      throw new Error(error);
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
