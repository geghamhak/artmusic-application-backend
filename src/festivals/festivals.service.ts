import { Injectable } from '@nestjs/common';
import { CreateFestivalDto } from './dto/create-festival.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Festival } from './entities/festival.entity';

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
  create(createFestivalDto: CreateFestivalDto) {
    return this.festivalRepository.create(createFestivalDto);
  }

  remove(id: number) {
    return this.festivalRepository.delete(id);
  }
}
