import { Injectable } from '@nestjs/common';
import { CreateNominationDto } from './dto/create-nomination.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Nomination } from "./entities/nomination.entity";

@Injectable()
export class NominationsService {
  constructor(
    @InjectRepository(Nomination)
    private nominationRepository: Repository<Nomination>,
  ) {}

  findAll() {
    return this.nominationRepository.find();
  }

  findOne(id: number) {
    return this.nominationRepository.findOneBy({ id });
  }
  create(createNominationDto: CreateNominationDto) {
    return this.nominationRepository.create(createNominationDto);
  }

  remove(id: number) {
    return this.nominationRepository.delete(id);
  }
}
