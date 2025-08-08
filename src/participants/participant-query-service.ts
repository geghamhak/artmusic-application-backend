import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Participant } from './entities/participant.entity';
import { CreateParticipantDto } from './dto/create-participant.dto';

@Injectable()
export class ParticipantQueryService {
  constructor(
    @InjectRepository(Participant)
    private participantRepository: Repository<Participant>,
  ) {}

  async save(participant: Participant): Promise<Participant> {
    return await this.participantRepository.save(participant);
  }

  async getByFullData(participant: CreateParticipantDto): Promise<Participant> {
    const { firstName, lastName, birthYear, fatherName } = participant;
    return await this.participantRepository
      .createQueryBuilder('participant')
      .leftJoinAndSelect('participant.applications', 'application')
      .leftJoinAndSelect('application.festival', 'festival')
      .leftJoinAndSelect('participant.firstName', 'firstNameTextContent')
      .leftJoinAndSelect(
        'firstNameTextContent.translations',
        'firstNameTranslations',
      )
      .leftJoinAndSelect('participant.lastName', 'lastNameTextContent')
      .leftJoinAndSelect(
        'lastNameTextContent.translations',
        'lastNameTranslations',
      )
      .leftJoinAndSelect('participant.fatherName', 'fatherNameTextContent')
      .leftJoinAndSelect(
        'fatherNameTextContent.translations',
        'fatherNameTranslations',
      )
      .where('participant.birthYear = :birthYear', { birthYear })
      .andWhere('firstNameTranslations.translation = :firstName', { firstName })
      .andWhere('lastNameTranslations.translation = :lastName', { lastName })
      .andWhere('fatherNameTranslations.translation = :fatherName', {
        fatherName,
      })
      .select([
        'participant.id',
        'firstNameTranslations.translation',
        'lastNameTranslations.translation',
        'fatherNameTranslations.translation',
      ])
      .getOne();
  }
  async getByFullDataAndFestivalId(
    participant: CreateParticipantDto,
    festivalId: number,
  ): Promise<Participant> {
    const { firstName, lastName, birthYear, fatherName } = participant;
    return await this.participantRepository
      .createQueryBuilder('participant')
      .leftJoinAndSelect('participant.applications', 'application')
      .leftJoinAndSelect('application.festival', 'festival')
      .leftJoinAndSelect('participant.firstName', 'firstNameTextContent')
      .leftJoinAndSelect(
        'firstNameTextContent.translations',
        'firstNameTranslations',
      )
      .leftJoinAndSelect('participant.lastName', 'lastNameTextContent')
      .leftJoinAndSelect(
        'lastNameTextContent.translations',
        'lastNameTranslations',
      )
      .leftJoinAndSelect('participant.fatherName', 'fatherNameTextContent')
      .leftJoinAndSelect(
        'fatherNameTextContent.translations',
        'fatherNameTranslations',
      )
      .where('festival.id = :festivalId', { festivalId })
      .andWhere('participant.birthYear = :birthYear', { birthYear })
      .andWhere('firstNameTranslations.translation = :firstName', { firstName })
      .andWhere('lastNameTranslations.translation = :lastName', { lastName })
      .andWhere('fatherNameTranslations.translation = :fatherName', {
        fatherName,
      })
      .select([
        'participant.id',
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

  async getParticipantForRemoval(id: number): Promise<Participant> {
    return await this.participantRepository
      .createQueryBuilder('participant')
      .leftJoinAndSelect('participant.firstName', 'firstNameTextContent')
      .leftJoinAndSelect('participant.lastName', 'lastNameTextContent')
      .leftJoinAndSelect('participant.fatherName', 'fatherNameTextContent')
      .where('participant.id = :id', { id })
      .select([
        'participant.id',
        'firstNameTextContent.id',
        'lastNameTextContent.id',
        'fatherNameTextContent.id',
      ])
      .getOne();
  }

  async deleteParticipant(id: number): Promise<void> {
    await this.participantRepository.delete(id);
  }
}
