import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateFestivalTypeDto } from './dto/create-festival-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FestivalType } from './entities/festival-type.entity';
import { TextContentService } from '../translations/text-content.service';
import { UpdateFestivalTypeDto } from './dto/update-festival-type.dto';

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

  async getByKey(festivalName: string): Promise<FestivalType> {
    const festivalType = await this.festivalTypeRepository
      .createQueryBuilder('festivalType')
      .where('festivalType.key= :festivalName', { festivalName })
      .select()
      .getOne();
    if (!festivalType) {
      throw new BadRequestException('Festival type not found');
    }
    return festivalType;
  }

  async create(createFestivalTypeDto: CreateFestivalTypeDto) {
    try {
      const {
        name,
        description,
        key,
        subNominationIds,
        isParticipantTypeActive,
        secondComposition,
        thirdComposition,
        compositionTotalDuration,
        isOnline,
      } = createFestivalTypeDto;
      const newFestivalType = new FestivalType();
      newFestivalType.name =
        await this.textContentService.addTranslations(name);
      newFestivalType.description =
        await this.textContentService.addTranslations(description);
      newFestivalType.key = key;
      if (subNominationIds.length > 0) {
        newFestivalType.subNominationIds = subNominationIds;
      }
      if (isParticipantTypeActive !== undefined) {
        newFestivalType.isParticipantTypeActive = isParticipantTypeActive
          ? 1
          : 0;
      }
      if (secondComposition !== undefined) {
        newFestivalType.secondComposition = secondComposition ? 1 : 0;
      }
      if (thirdComposition !== undefined) {
        newFestivalType.thirdComposition = thirdComposition ? 1 : 0;
      }
      if (isOnline !== undefined) {
        newFestivalType.isOnline = isOnline ? 1 : 0;
      }
      if (compositionTotalDuration !== undefined) {
        newFestivalType.compositionTotalDuration = compositionTotalDuration;
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
        isOnline: festivalType.isOnline === 1,
        secondComposition: festivalType.secondComposition === 1,
        thirdComposition: festivalType.thirdComposition === 1,
        compositionTotalDuration: festivalType.compositionTotalDuration,
        isParticipantTypeActive: festivalType.isParticipantTypeActive === 1,
      };
    });
  }

  remove(id: number) {
    return this.festivalTypeRepository.delete(id);
  }

  async update(id: number, updateFestivalTypeDto: UpdateFestivalTypeDto) {
    try {
      const festivalType = await this.findById(id);
      const {
        name,
        description,
        key,
        subNominationIds,
        isParticipantTypeActive,
        secondComposition,
        thirdComposition,
        compositionTotalDuration,
        isOnline,
      } = updateFestivalTypeDto;
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
      if (isParticipantTypeActive !== undefined) {
        festivalType.isParticipantTypeActive = isParticipantTypeActive ? 1 : 0;
      }
      if (secondComposition !== undefined) {
        festivalType.secondComposition = secondComposition ? 1 : 0;
      }
      if (thirdComposition !== undefined) {
        festivalType.thirdComposition = thirdComposition ? 1 : 0;
      }
      if (isOnline !== undefined) {
        festivalType.isOnline = isOnline ? 1 : 0;
      }
      if (compositionTotalDuration !== undefined) {
        festivalType.compositionTotalDuration = compositionTotalDuration;
      }
      return this.festivalTypeRepository.save(festivalType);
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException('Unable to update festival type');
    }
  }
  async findConfigByType(type: string) {
    const festivalType = await this.getByKey(type);
    return {
      isParticipantTypeActive: festivalType.isParticipantTypeActive === 1,
      secondComposition: festivalType.secondComposition === 1,
      thirdComposition: festivalType.thirdComposition === 1,
      compositionTotalDuration: festivalType.compositionTotalDuration,
      isOnline: festivalType.isOnline === 1,
      subNominationIds: festivalType.subNominationIds || [],
    };
  }
}
