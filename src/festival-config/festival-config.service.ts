import { Injectable } from '@nestjs/common';
import { CreateFestivalConfigDto } from './dto/create-festival-config.dto';
import { UpdateFestivalConfigDto } from './dto/update-festival-config.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FestivalConfig } from './entities/festival-config.entity';
import { Festival } from '../festivals/entities/festival.entity';
import { FestivalTypesService } from '../festival-types/festival-types.service';

@Injectable()
export class FestivalConfigService {
  constructor(
    @InjectRepository(FestivalConfig)
    private festivalConfigRepository: Repository<FestivalConfig>,
    private readonly festivalTypeService: FestivalTypesService,
  ) {}
  async create(
    createFestivalConfigDto: CreateFestivalConfigDto,
  ): Promise<FestivalConfig> {
    const newFestivalConfig = new FestivalConfig();
    const { secondComposition, thirdComposition, isOnline } =
      createFestivalConfigDto;
    if (secondComposition !== undefined) {
      newFestivalConfig.secondComposition =
        JSON.parse(secondComposition) === true ? 1 : 0;
    }

    if (thirdComposition !== undefined) {
      newFestivalConfig.thirdComposition =
        JSON.parse(thirdComposition) === true ? 1 : 0;
    }

    if (isOnline !== undefined) {
      newFestivalConfig.isOnline = JSON.parse(isOnline) === true ? 1 : 0;
    }
    return await this.festivalConfigRepository.save(newFestivalConfig);
  }

  async update(
    festival: Festival,
    updateFestivalConfigDto: UpdateFestivalConfigDto,
  ): Promise<FestivalConfig> {
    const festivalConfig = await this.festivalConfigRepository.findOneBy({
      id: festival.config.id,
    });

    const { secondComposition, thirdComposition, isOnline } =
      updateFestivalConfigDto;

    if (secondComposition !== undefined) {
      festivalConfig.secondComposition =
        JSON.parse(secondComposition) === true ? 1 : 0;
    }

    if (thirdComposition !== undefined) {
      festivalConfig.thirdComposition =
        JSON.parse(thirdComposition) === true ? 1 : 0;
    }

    if (isOnline !== undefined) {
      festivalConfig.isOnline = JSON.parse(isOnline) === true ? 1 : 0;
    }

    await this.festivalConfigRepository.save(festivalConfig);

    return festivalConfig;
  }

  async mapFestivalConfigs(
    festivalConfig: FestivalConfig,
    festivalType: string,
  ) {
    const globalConfigByType =
      await this.festivalTypeService.findConfigByType(festivalType);
    if (festivalConfig?.secondComposition !== undefined) {
      globalConfigByType.secondComposition =
        festivalConfig?.secondComposition === 1;
    }
    if (festivalConfig?.thirdComposition !== undefined) {
      globalConfigByType.thirdComposition =
        festivalConfig?.thirdComposition === 1;
    }
    if (festivalConfig?.isOnline !== undefined) {
      globalConfigByType.isOnline = festivalConfig?.isOnline === 1;
    }

    return globalConfigByType;
  }
}
