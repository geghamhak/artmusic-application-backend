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
  async create(
    createParticipantDtos: CreateParticipantDto[],
  ): Promise<Participant[]> {
    try {
      const participants: Participant[] = [];
      createParticipantDtos.map(async (createParticipantDocumentDto) => {
        console.log(createParticipantDocumentDto.firstName);
        console.log(createParticipantDocumentDto.lastName);
        const participant = new Participant();
        participant.firstName = createParticipantDocumentDto.firstName;
        participant.lastName = createParticipantDocumentDto.lastName;
        participant.birthYear = createParticipantDocumentDto.birthYear;
        if (createParticipantDocumentDto.fatherName) {
          participant.fatherName = createParticipantDocumentDto.fatherName;
        }
        await this.participantRepository.save(participant);
        participants.push(participant);
      });

      return participants;
    } catch (e) {
      throw new Error('Unable to create participant');
    }
  }
}
