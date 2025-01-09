import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Region } from './entities/region.entity';

@Injectable()
export class RegionsService {
  constructor(
    @InjectRepository(Region)
    private regionRepository: Repository<Region>,
  ) {}
  async findAll() {
    const regions = await this.regionRepository
      .createQueryBuilder('region')
      .leftJoinAndSelect('region.name', 'textContent')
      .leftJoinAndSelect('textContent.translations', 'translations')
      .select(['region.id', 'textContent.id', 'translations.translation'])
      .getMany();
    return regions.map((region) => {
      return { id: region.id, name: region.name.translations[0].translation };
    });
  }

  findOne(id: number) {
    return this.regionRepository.findOneBy({ id });
  }
}
