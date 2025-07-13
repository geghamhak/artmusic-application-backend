import { Injectable } from '@nestjs/common';
import { Festival } from '../festivals/entities/festival.entity';
import { IFestivalJuries } from '../festivals/festivals.service';
import { FestivalJury } from './entities/festival-jury.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Nomination } from '../nominations/entities/nomination.entity';
import { SubNomination } from '../sub-nominations/entities/sub-nomination.entity';
import { Jury } from '../juries/entities/jury.entity';

@Injectable()
export class FestivalJuryService {
  constructor(
    @InjectRepository(FestivalJury)
    private festivalJuryRepository: Repository<FestivalJury>,
  ) {}

  async add(festivalJuries: IFestivalJuries[], festivalId: number) {
    const addedFestivalJuries: FestivalJury[] = [];
    festivalJuries.map((festivalJury) => {
      return festivalJury.juryIds.map(async (jury: number) => {
        const newFestivalJury = new FestivalJury();
        if (festivalJury.nominationId) {
          newFestivalJury.nomination = {
            id: festivalJury.nominationId,
          } as Nomination;
        }
        if (festivalJury.subNominationId) {
          newFestivalJury.subNomination = {
            id: festivalJury.subNominationId,
          } as SubNomination;
        }
        newFestivalJury.festival = { id: festivalId } as Festival;
        newFestivalJury.jury = { id: jury } as Jury;

        addedFestivalJuries.push(
          await this.festivalJuryRepository.save(newFestivalJury),
        );
      });
    });

    return addedFestivalJuries;
  }

  async findByFestivalId(festivalId: number): Promise<FestivalJury[]> {
    return this.festivalJuryRepository
      .createQueryBuilder('festival_jury')
      .leftJoinAndSelect('festival_jury.festival', 'festival')
      .leftJoinAndSelect('festival_jury.nomination', 'nomination')
      .leftJoinAndSelect('festival_jury.subNomination', 'subNomination')
      .leftJoinAndSelect('festival_jury.jury', 'jury')
      .where('festivalId = :festivalId', { festivalId })
      .select([
        'festival_jury.id',
        'festival.id',
        'subNomination.id',
        'nomination.id',
        'jury.id',
      ])
      .orderBy('nomination.id')
      .getMany();
  }

  async findJuriesCount (festivalId: number, nominationId?: number, subNominationId?: number) {
    try {
      const queryBuilder = this.festivalJuryRepository
      .createQueryBuilder('festival_jury')
      .where('festival_jury.festivalId = :festivalId', { festivalId })
      if(nominationId) {
        queryBuilder.andWhere('festival_jury.nominationId = :nominationId', { nominationId })
      }

      if(subNominationId) {
        queryBuilder.andWhere('festival_jury.subNominationId = :subNominationId', { subNominationId })
      }

      return await queryBuilder.select().getCount()
    } catch (error) {
      throw error;
    }
  }

  async removeByNominationId(festivalId: number, nominationId: number) {
    try {
      return await this.festivalJuryRepository
        .createQueryBuilder('festival_jury')
        .where('festival_jury.nominationId = :nominationId', { nominationId })
        .andWhere('festival_jury.festivalId = :festivalId', { festivalId })
        .delete()
        .execute();
    } catch (error) {
      throw error;
    }
  }
  async removeBySubNominationId(festivalId: number, subNominationId: number) {
    try {
      return await this.festivalJuryRepository
        .createQueryBuilder('festival_jury')
        .where('festival_jury.subNominationId = :subNominationId', {
          subNominationId,
        })
        .andWhere('festival_jury.festivalId = :festivalId', { festivalId })
        .delete()
        .execute();
    } catch (error) {
      throw error;
    }
  }
}
