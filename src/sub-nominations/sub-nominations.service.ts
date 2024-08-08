import { Injectable } from '@nestjs/common';
import { CreateSubNominationDto } from './dto/create-sub-nomination.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SubNomination } from "./entities/sub-nomination.entity";

@Injectable()
export class SubNominationsService {
  constructor(
    @InjectRepository(SubNomination)
    private subNominationRepository: Repository<SubNomination>,
  ) {}

  findAll() {
    return this.subNominationRepository.find();
  }

  findOne(id: number) {
    return this.subNominationRepository.findOneBy({ id });
  }
  create(createSubNominationDto: CreateSubNominationDto) {
    return this.subNominationRepository.create(createSubNominationDto);
  }

  remove(id: number) {
    return this.subNominationRepository.delete(id);
  }
}
