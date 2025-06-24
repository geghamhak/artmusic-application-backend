import { Injectable } from '@nestjs/common';
import { CreateFestivalConfigDto } from './dto/create-festival-config.dto';
import { UpdateFestivalConfigDto } from './dto/update-festival-config.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FestivalConfig } from './entities/festival-config.entity';
import { Festival } from '../festivals/entities/festival.entity';
import { FestivalsGlobalConfig } from './types';
import { FestivalTypesEnum } from '../festival-types/festival-types.service';

export interface ShouldUpdateFestival {
  festivalConfig: FestivalConfig;
  shouldUpdate: boolean;
}
@Injectable()
export class FestivalConfigService {
  constructor(
    @InjectRepository(FestivalConfig)
    private festivalConfigRepository: Repository<FestivalConfig>,
  ) {}
  async create(
    createFestivalConfigDto: CreateFestivalConfigDto,
  ): Promise<FestivalConfig> {
    return await this.festivalConfigRepository.save(createFestivalConfigDto);
  }

  async update(
    festival: Festival,
    updateFestivalConfigDto: UpdateFestivalConfigDto,
  ): Promise<ShouldUpdateFestival> {
    const festivalConfig = await this.festivalConfigRepository.findOneBy({
      id: festival.config.id,
    });
    let shouldUpdate = false;
    const { secondComposition, thirdComposition, isOnline } =
      updateFestivalConfigDto;
    if (
      secondComposition &&
      festivalConfig.secondComposition !== secondComposition
    ) {
      festivalConfig.secondComposition = secondComposition;
      shouldUpdate = true;
    }

    if (
      thirdComposition &&
      festivalConfig.thirdComposition !== thirdComposition
    ) {
      festivalConfig.thirdComposition = thirdComposition;
      shouldUpdate = true;
    }

    if (isOnline && festivalConfig.isOnline !== isOnline) {
      festivalConfig.isOnline = isOnline;
      shouldUpdate = true;
    }
    if (shouldUpdate) {
      await this.festivalConfigRepository.save(festivalConfig);
    }

    return { festivalConfig, shouldUpdate };
  }

  mapFestivalConfigs(
    festivalConfig: FestivalConfig,
    festivalType: FestivalTypesEnum,
  ) {
    const globalConfigByType = FestivalsGlobalConfig[festivalType];
    const { secondComposition, thirdComposition, isOnline } = festivalConfig;
    if (festivalConfig.secondComposition) {
      globalConfigByType.secondComposition = secondComposition;
    }
    if (festivalConfig.thirdComposition) {
      globalConfigByType.thirdComposition = thirdComposition;
    }
    if (festivalConfig.isOnline) {
      globalConfigByType.isOnline = isOnline;
    }

    return globalConfigByType;
  }
}
