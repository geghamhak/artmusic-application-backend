import { Injectable } from '@nestjs/common';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Participant } from './entities/participant.entity';

@Injectable()
export class ParticipantsService {
  constructor(
    @InjectRepository(Participant)
    private participantRepository: Repository<Participant>,
  ) {}
  async saveMany(
    createParticipantDto: CreateParticipantDto[],
  ): Promise<Participant[]> {
    try {
      const participants = createParticipantDto.map((createParticipant) => {
        return this.create(createParticipant);
      });

      return await Promise.all(participants);
    } catch (e) {
      throw new Error('Unable to create participant');
    }
  }

  async create(createParticipant: CreateParticipantDto): Promise<Participant> {
    const participant = new Participant();
    participant.firstName = createParticipant.firstName;
    participant.lastName = createParticipant.lastName;
    participant.birthYear = createParticipant.birthYear;
    if (createParticipant.fatherName) {
      participant.fatherName = createParticipant.fatherName;
    }
    return await this.participantRepository.save(participant);
  }
}
