import { Injectable } from '@nestjs/common';
import { CreateFestivalJuryDto } from './dto/create-festival-jury.dto';
import { UpdateFestivalJuryDto } from './dto/update-festival-jury.dto';

@Injectable()
export class FestivalJuryService {
  create(createFestivalJuryDto: CreateFestivalJuryDto) {
    return 'This action adds a new festivalJury';
  }

  findAll() {
    return `This action returns all festivalJury`;
  }

  findOne(id: number) {
    return `This action returns a #${id} festivalJury`;
  }

  update(id: number, updateFestivalJuryDto: UpdateFestivalJuryDto) {
    return `This action updates a #${id} festivalJury`;
  }

  remove(id: number) {
    return `This action removes a #${id} festivalJury`;
  }
}
