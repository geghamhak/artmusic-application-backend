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
      .select(['region.id', 'textContent.originalText'])
      .getMany();
    return regions.map((region) => {
      return { id: region.id, name: region.name.originalText };
    });
  }

  findOne(id: number) {
    return this.regionRepository.findOneBy({ id });
  }
}
