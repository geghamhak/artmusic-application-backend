import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFestivalTypeDto } from './dto/create-festival-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FestivalType } from './entities/festival-type.entity';
import { Festival } from '../festivals/entities/festival.entity';
import { TextContentService } from '../translations/text-content.service';

export enum FestivalTypesEnum {
  ARTMUSIC = 'artmusic',
  MELODY = 'melody',
  NEW_HANDS = 'new_hands',
  LYRICS = 'lyrics',
  ART_PIANO = 'art_piano',
  KHACHATUR_AVETISYAN = 'khachatur_avetisyan',
  FOREIGN = 'foreign',
  ART_DANCE = 'art_dance',
  EGHEGAN_POGH = 'eghegan_pogh',
}

@Injectable()
export class FestivalTypesService {
  constructor(
    @InjectRepository(FestivalType)
    private festivalTypeRepository: Repository<FestivalType>,
    private textContentService: TextContentService,
  ) {}

  async getByKey(festivalName: FestivalTypesEnum): Promise<FestivalType> {
    return await this.festivalTypeRepository
      .createQueryBuilder('festivalType')
      .where('festivalType.key= :festivalName', { festivalName })
      .select(['festivalType.id'])
      .getOne();
  }

  async create(createFestivalTypeDto: CreateFestivalTypeDto) {
    try {
      const { name } = createFestivalTypeDto;
      await this.checkIfFestivalExists(
        name[0].translation as FestivalTypesEnum,
      );
      const newFestivalType = new Festival();
      newFestivalType.title =
        await this.textContentService.addTranslations(name);
      return this.festivalTypeRepository.save(newFestivalType);
    } catch (error) {
      throw new Error('Unable to create festival type');
    }
  }

  private async checkIfFestivalExists(name: FestivalTypesEnum) {
    const existingFestival = await this.getByKey(name as FestivalTypesEnum);
    if (existingFestival) {
      return new BadRequestException(
        `The festival with name '${name}' already exists`,
      );
    }
  }

  async findAllKeys() {
    const festivalTypes = await this.festivalTypeRepository
      .createQueryBuilder('festival_type')
      .select(['festival_type.key'])
      .getMany();
    return { festivalTypes: festivalTypes.map((i) => i.key) };
  }

  remove(id: number) {
    return this.festivalTypeRepository.delete(id);
  }
}
