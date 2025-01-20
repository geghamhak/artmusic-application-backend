import { Injectable } from '@nestjs/common';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Participant } from './entities/participant.entity';

export enum ParticipantType {
  SOLO = 'SOLO',
  DUO = 'DUO',
  TRIO = 'TRIO',
  QUARTET = 'QUARTET',
  ORCHESTRA = 'ORCHESTRA',
  ENSEMBLE = 'ENSEMBLE',
}

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
      const participants = createParticipantDto.map(
        async (createParticipant) => {
          const existingParticipant =
            await this.getByFullData(createParticipant);
          if (existingParticipant) {
            return existingParticipant;
          }
          return this.create(createParticipant);
        },
      );

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

  async getByFullData(participant: CreateParticipantDto): Promise<Participant> {
    return await this.participantRepository.findOneBy({
      firstName: participant.firstName,
      lastName: participant.lastName,
      fatherName: participant.fatherName,
      birthYear: participant.birthYear,
    });
  }
  async getByApplicationId(applicationId: number): Promise<Participant[]> {
    return await this.participantRepository
      .createQueryBuilder('participant')
      .leftJoinAndSelect('participant.applications', 'application')
      .where('application.id = :applicationId', { applicationId })
      .select()
      .getMany();
  }

  compareParticipantsArrays(
    createParticipantDto: CreateParticipantDto[],
    existingParticipants: Participant[],
  ) {
    return existingParticipants.every((existingParticipant) =>
      createParticipantDto.some(
        (newParticipant) =>
          existingParticipant.firstName === newParticipant.firstName &&
          existingParticipant.lastName === newParticipant.lastName &&
          existingParticipant.fatherName === newParticipant.fatherName &&
          existingParticipant.birthYear === newParticipant.birthYear,
      ),
    );
  }
}
