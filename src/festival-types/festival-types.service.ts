import { Injectable } from '@nestjs/common';
import { CreateFestivalTypeDto } from './dto/create-festival-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FestivalType } from './entities/festival-type.entity';
import { FestivalsEnum } from '../festivals/festivals.service';

@Injectable()
export class FestivalTypesService {
  constructor(
    @InjectRepository(FestivalType)
    private festivalTypeRepository: Repository<FestivalType>,
  ) {}

  async getByName(festivalName: FestivalsEnum): Promise<FestivalType> {
    return await this.festivalTypeRepository
      .createQueryBuilder('festivalType')
      .leftJoinAndSelect('festivalType.name', 'textContent')
      .leftJoinAndSelect('textContent.translations', 'translations')
      .where('translations.translation= :name', { name: festivalName })
      .select(['festival.id'])
      .getOne();
  }

  findAll() {
    return this.festivalTypeRepository.find();
  }

  findOne(id: number) {
    return this.festivalTypeRepository.findOneBy({ id });
  }
  create(createFestivalTypeDto: CreateFestivalTypeDto) {
    return this.festivalTypeRepository.create(createFestivalTypeDto);
  }

  remove(id: number) {
    return this.festivalTypeRepository.delete(id);
  }
}
