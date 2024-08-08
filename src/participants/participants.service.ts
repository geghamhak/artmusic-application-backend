import { Injectable } from '@nestjs/common';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Participant } from "./entities/participant.entity";

@Injectable()
export class ParticipantsService {
  constructor(
    @InjectRepository(Participant)
    private participantRepository: Repository<Participant>,
  ) {}
  create(createParticipantDtos: CreateParticipantDto[]) {
    try {
      const participants = [];
      createParticipantDtos.map((createParticipantDocumentDto) => {
        const participant =  this.participantRepository.create(createParticipantDocumentDto);
        participants.push(participant);
      });

      return participants;
    }  catch (e) {
      throw new Error('Unable to create participant');
    }
  }
}
