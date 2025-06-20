import { Injectable } from '@nestjs/common';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Participant } from './entities/participant.entity';
import { TextContentService } from '../translations/text-content.service';

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
    private textContentService: TextContentService,
  ) {}
  async saveMany(
    createParticipantDto: CreateParticipantDto[],
    festivalId: number,
    languageCode: string,
  ): Promise<Participant[]> {
    try {
      const participants = createParticipantDto.map(
        async (createParticipant) => {
          const existingParticipant = await this.getByFullData(
            createParticipant,
            festivalId,
            languageCode,
          );
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
    return await this.participantRepository.save(participant);
  }

  async getByFullData(
    participant: CreateParticipantDto,
    festivalId: number,
    languageCode: string,
  ): Promise<Participant> {
    const { firstName, lastName, birthYear, fatherName } = participant;
    return await this.participantRepository
      .createQueryBuilder('participants')
      .leftJoinAndSelect('participant.applications', 'application')
      .leftJoinAndSelect('application.festivalId', 'festival.id')
      .leftJoinAndSelect('application.festivalId', 'festival.id')
      .leftJoinAndSelect('participant.firstName', 'firstNameTextContent')
      .leftJoinAndSelect(
        'firstNameTextContent.translations',
        'firstNameTranslations',
      )
      .leftJoinAndSelect('participant.lastname', 'lastNameTextContent')
      .leftJoinAndSelect(
        'lastNameTextContent.translations',
        'lastNameTranslations',
      )
      .leftJoinAndSelect('participant.fatherName', 'fatherNameTextContent')
      .leftJoinAndSelect(
        'fatherNameTextContent.translations',
        'fatherNameTranslations',
      )
      .where('application.festivalId = :festivalId', { festivalId })
      .andWhere('participants.birthYear = :birthYear', { birthYear })
      .andWhere('firstNameTranslations.languageCode = :languageCode', {
        languageCode,
      })
      .andWhere('firstNameTranslations.translation = :firstname', { firstName })
      .andWhere('lastNameTranslations.languageCode = :languageCode', {
        languageCode,
      })
      .andWhere('lastNameTranslations.translation = :lastName', { lastName })
      .andWhere('fatherNameTranslations.languageCode = :languageCode', {
        languageCode,
      })
      .andWhere('fatherNameTranslations.translation = :fatherName', {
        fatherName,
      })
      .select([
        'participants.id',
        'firstNameTranslations.translation',
        'lastNameTranslations.translation',
        'fatherNameTranslations.translation',
      ])
      .getOne();
  }
  async getByApplicationId(
    applicationId: number,
    languageCode: string,
  ): Promise<Participant[]> {
    return await this.participantRepository
      .createQueryBuilder('participant')
      .leftJoinAndSelect('participant.applications', 'application')
      .leftJoinAndSelect('participant.firstName', 'firstNameTextContent')
      .leftJoinAndSelect(
        'firstNameTextContent.translations',
        'firstNameTranslations',
      )
      .leftJoinAndSelect('participant.lastname', 'lastNameTextContent')
      .leftJoinAndSelect(
        'lastNameTextContent.translations',
        'lastNameTranslations',
      )
      .leftJoinAndSelect('participant.fatherName', 'fatherNameTextContent')
      .leftJoinAndSelect(
        'fatherNameTextContent.translations',
        'fatherNameTranslations',
      )
      .where('application.id = :applicationId', { applicationId })
      .andWhere('firstNameTranslations.languageCode = :languageCode', {
        languageCode,
      })
      .andWhere('lastNameTranslations.languageCode = :languageCode', {
        languageCode,
      })
      .andWhere('fatherNameTranslations.languageCode = :languageCode', {
        languageCode,
      })
      .select([
        'participants.id',
        'firstNameTranslations.translation',
        'lastNameTranslations.translation',
        'fatherNameTranslations.translation',
      ])
      .getMany();
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
      const participant = await this.participantRepository
        .createQueryBuilder('participant')
        .leftJoinAndSelect('participant.firstName', 'firstNameTextContent')
        .leftJoinAndSelect('participant.lastName', 'lastNameTextContent')
        .leftJoinAndSelect('participant.fatherName', 'fatherNameTextContent')
        .where('participant.id = :id', { id })
        .select([
          'firstNameTextContent.id',
          'lastNameTextContent.id',
          'fatherNameTextContent.id',
        ])
        .getOne();

      const { firstName, lastName, fatherName } = participant;

      await this.textContentService.deleteByIds([
        firstName.id,
        lastName.id,
        fatherName.id,
      ]);
      await this.participantRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }
}
