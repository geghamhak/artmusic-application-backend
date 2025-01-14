import { Injectable } from '@nestjs/common';
import { CreateApplicationCompositionDto } from './dto/create-application-composition.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationComposition } from './entities/application-composition.entity';

@Injectable()
export class ApplicationCompositionService {
  constructor(
    @InjectRepository(ApplicationComposition)
    private applicationCompositionRepository: Repository<ApplicationComposition>,
  ) {}
  async create(
    createApplicationCompositionDto: CreateApplicationCompositionDto,
  ): Promise<ApplicationComposition> {
    const composition = new ApplicationComposition();
    composition.title = createApplicationCompositionDto.title;
    return this.applicationCompositionRepository.save(composition);
  }

  async saveMany(
    createApplicationCompositions: CreateApplicationCompositionDto[],
  ): Promise<ApplicationComposition[]> {
    try {
      const allCompositions = createApplicationCompositions.map(
        (composition) => {
          return this.create(composition);
        },
      );

      return await Promise.all(allCompositions);
    } catch (error) {
      throw new Error('Unable to create compositions');
    }
  }
}
