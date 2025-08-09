import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateFestivalTypeDto } from './dto/create-festival-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FestivalType } from './entities/festival-type.entity';
import { Festival } from '../festivals/entities/festival.entity';
import { TextContentService } from '../translations/text-content.service';
import { UpdateFestivalTypeDto } from './dto/update-festival-type.dto';

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

  async findById(id: number): Promise<FestivalType> {
    const festivalType = await this.festivalTypeRepository
      .createQueryBuilder('festivalType')
      .leftJoinAndSelect('festivalType.name', 'nameTextContent')
      .leftJoinAndSelect('festivalType.description', 'descriptionTextContent')
      .where('festivalType.id = :id', { id })
      .select()
      .getOne();

    if (!festivalType) {
      throw new BadRequestException('Festival type not found');
    }
    return festivalType;
  }

  async getByKey(festivalName: FestivalTypesEnum): Promise<FestivalType> {
    return await this.festivalTypeRepository
      .createQueryBuilder('festivalType')
      .where('festivalType.key= :festivalName', { festivalName })
      .select(['festivalType.id'])
      .getOne();
  }

  async create(createFestivalTypeDto: CreateFestivalTypeDto) {
    try {
      const { name, description, key, subNominationIds } =
        createFestivalTypeDto;
      const newFestivalType = new FestivalType();
      newFestivalType.name =
        await this.textContentService.addTranslations(name);
      newFestivalType.description =
        await this.textContentService.addTranslations(description);
      newFestivalType.key = key;
      if (subNominationIds.length > 0) {
        newFestivalType.subNominationIds = subNominationIds;
      }
      return this.festivalTypeRepository.save(newFestivalType);
    } catch (error) {
      throw new Error('Unable to create festival type');
    }
  }

  async findAllKeys() {
    const festivalTypes = await this.festivalTypeRepository
      .createQueryBuilder('festival_type')
      .select(['festival_type.key'])
      .getMany();
    return { festivalTypes: festivalTypes.map((i) => i.key) };
  }

  async findAll() {
    const festivalTypes = await this.festivalTypeRepository
      .createQueryBuilder('festival_type')
      .leftJoinAndSelect('festival_type.name', 'nameTextContent')
      .leftJoinAndSelect('nameTextContent.translations', 'nameTranslations')
      .leftJoinAndSelect('nameTranslations.language', 'nameLanguage')
      .leftJoinAndSelect('festival_type.description', 'descriptionTextContent')
      .leftJoinAndSelect(
        'descriptionTextContent.translations',
        'descriptionTranslations',
      )
      .leftJoinAndSelect(
        'descriptionTranslations.language',
        'descriptionLanguage',
      )
      .select()
      .getMany();

    return festivalTypes.map((festivalType) => {
      return {
        id: festivalType.id,
        key: festivalType.key,
        name: festivalType.name.translations.map((t) => ({
          translation: t.translation,
          languageCode: t.language.code,
        })),
        description: festivalType.description.translations.map((t) => ({
          translation: t.translation,
          languageCode: t.language.code,
        })),
        subNominationIds: festivalType.subNominationIds || [],
      };
    });
  }

  remove(id: number) {
    return this.festivalTypeRepository.delete(id);
  }

  async update(id: number, updateFestivalTypeDto: UpdateFestivalTypeDto) {
    try {
      const festivalType = await this.findById(id);
      const { name, description, key, subNominationIds } =
        updateFestivalTypeDto;
      if (name && name.length > 0) {
        festivalType.name = await this.textContentService.updateTranslations(
          festivalType.name,
          name,
        );
      }
      if (description && description.length > 0) {
        festivalType.description =
          await this.textContentService.updateTranslations(
            festivalType.description,
            description,
          );
      }
      if (subNominationIds && subNominationIds.length > 0) {
        festivalType.subNominationIds = subNominationIds;
      }
      if (key) {
        festivalType.key = key;
      }
      return this.festivalTypeRepository.save(festivalType);
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Unable to update festival type');
    }
  }
}
