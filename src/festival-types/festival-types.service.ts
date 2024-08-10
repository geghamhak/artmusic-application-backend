import { Injectable } from '@nestjs/common';
import { CreateFestivalTypeDto } from './dto/create-festival-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FestivalType } from './entities/festival-type.entity';

@Injectable()
export class FestivalTypesService {
  constructor(
    @InjectRepository(FestivalType)
    private festivalTypeRepository: Repository<FestivalType>,
  ) {}

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
