import { Injectable } from '@nestjs/common';
import { CreateParticipantTypeDto } from './dto/create-participant-type.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ParticipantType } from "./entities/participant-type.entity";

@Injectable()
export class ParticipantTypesService {
  constructor(
    @InjectRepository(ParticipantType)
    private participantTypeRepository: Repository<ParticipantType>,
  ) {}

  create(createParticipantTypeDto: CreateParticipantTypeDto) {
    return this.participantTypeRepository.create(createParticipantTypeDto);
  }

  findOne(id: number) {
    return this.participantTypeRepository.findOneBy({ id });
  }
}
