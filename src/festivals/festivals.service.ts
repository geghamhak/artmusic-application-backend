import { Injectable } from '@nestjs/common';
import { CreateFestivalDto } from './dto/create-festival.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Festival } from "./entities/festival.entity";

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
  create(createFestivalDto: CreateFestivalDto) {
    return this.festivalRepository.create(createFestivalDto);
  }

  remove(id: number) {
    return this.festivalRepository.delete(id);
  }
}
