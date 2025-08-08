import { Injectable } from '@nestjs/common';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { Participant } from './entities/participant.entity';
import { TextContentService } from '../translations/text-content.service';
import { ParticipantQueryService } from './participant-query-service';

export enum ParticipantTypeEnum {
  SOLO = 'SOLO',
  DUO = 'DUO',
  TRIO = 'TRIO',
  QUARTET = 'QUARTET',
  ORCHESTRA = 'ORCHESTRA',
  ENSEMBLE = 'ENSEMBLE',
}

export const ParticipantTypeMap = new Map<number, ParticipantTypeEnum>();
ParticipantTypeMap.set(1, ParticipantTypeEnum.SOLO);
ParticipantTypeMap.set(2, ParticipantTypeEnum.DUO);
ParticipantTypeMap.set(3, ParticipantTypeEnum.TRIO);
ParticipantTypeMap.set(4, ParticipantTypeEnum.QUARTET);

@Injectable()
export class ParticipantsService {
  constructor(
    private participantQueryService: ParticipantQueryService,
    private textContentService: TextContentService,
  ) {}
  async saveMany(
    createParticipantDto: CreateParticipantDto[],
    languageCode: string,
  ): Promise<Participant[]> {
    try {
      const participants = createParticipantDto.map(
        async (createParticipant) => {
          const existingParticipant =
            await this.participantQueryService.getByFullData(createParticipant);
          if (existingParticipant) {
            return existingParticipant;
          }
          return this.create(createParticipant, languageCode);
        },
      );

      return await Promise.all(participants);
    } catch (e) {
      throw new Error('Unable to create participant');
    }
  }

  async create(
    createParticipant: CreateParticipantDto,
    languageCode: string,
  ): Promise<Participant> {
    const participant = new Participant();
    participant.firstName = await this.textContentService.addTranslation({
      languageCode,
      translation: createParticipant.firstName,
    });
    participant.lastName = await this.textContentService.addTranslation({
      languageCode,
      translation: createParticipant.lastName,
    });
    participant.birthYear = createParticipant.birthYear;
    if (createParticipant.fatherName) {
      participant.fatherName = await this.textContentService.addTranslation({
        languageCode,
        translation: createParticipant.fatherName,
      });
    }
    return await this.participantQueryService.save(participant);
  }

  async getByFullData(
    participant: CreateParticipantDto,
    festivalId: number,
  ): Promise<Participant> {
    return await this.participantQueryService.getByFullDataAndFestivalId(
      participant,
      festivalId,
    );
  }

  async getByApplicationId(
    applicationId: number,
    languageCode: string,
  ): Promise<Participant[]> {
    return await this.participantQueryService.getByApplicationId(
      applicationId,
      languageCode,
    );
  }

  compareParticipantsArrays(
    createParticipantDto: CreateParticipantDto[],
    existingParticipants: Participant[],
  ) {
    return existingParticipants.every((existingParticipant) =>
      createParticipantDto.some(
        (newParticipant) =>
          existingParticipant.firstName[0].translation ===
            newParticipant.firstName &&
          existingParticipant.lastName[0].translation ===
            newParticipant.lastName &&
          existingParticipant.fatherName[0].translation ===
            newParticipant.fatherName &&
          existingParticipant.birthYear === newParticipant.birthYear,
      ),
    );
  }

  async remove(id: number): Promise<void> {
    try {
      const participant =
        await this.participantQueryService.getParticipantForRemoval(id);
      const { firstName, lastName, fatherName } = participant;

      await this.textContentService.deleteByIds([
        firstName.id,
        lastName.id,
        fatherName.id,
      ]);
      await this.participantQueryService.deleteParticipant(id);
    } catch (error) {
      throw error;
    }
  }
}
