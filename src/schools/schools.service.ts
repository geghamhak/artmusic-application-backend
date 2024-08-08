import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { School } from "./entities/school.entity";

@Injectable()
export class SchoolsService {
  constructor(
    @InjectRepository(School)
    private schoolRepository: Repository<School>,
  ) {}
  findAll() {
    return this.schoolRepository.find();
  }

  findOne(id: number) {
    return this.schoolRepository.findOneBy({ id });
  }
}
