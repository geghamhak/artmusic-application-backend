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
  create(
    createApplicationCompositionDto: CreateApplicationCompositionDto,
  ): ApplicationComposition {
    return this.applicationCompositionRepository.create(
      createApplicationCompositionDto,
    );
  }

  save(
    createApplicationCompositions: CreateApplicationCompositionDto[],
  ): ApplicationComposition[] {
    return createApplicationCompositions.map((composition) => {
      return this.create(composition);
    });
  }
}
