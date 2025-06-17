import { Injectable } from '@nestjs/common';
import { CreateJuryDto } from './dto/create-jury.dto';
import { UpdateJuryDto } from './dto/update-jury.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DmsService } from '../dms/dms.service';
import { TextContentService } from '../translations/text-content.service';
import { Jury } from './entities/jury.entity';

@Injectable()
export class JuriesService {
  constructor(
    @InjectRepository(Jury)
    private juryRepository: Repository<Jury>,
    private dmsService: DmsService,
    private textContentService: TextContentService,
  ) {}
  async create(createJuryDto: CreateJuryDto) {
    try {
      const { title, description, image } = createJuryDto;
      const newJury = new Jury();
      newJury.title = await this.textContentService.addTranslations(title);
      newJury.description =
        await this.textContentService.addTranslations(description);

      const jury = await this.juryRepository.save(newJury);

      await this.dmsService.uploadSingleFile({
        file: image,
        entity: 'juries',
        entityId: jury.id,
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    return await this.juryRepository.find();
  }

  async update(id: number, updateJuryDto: UpdateJuryDto) {
    try {
      const jury = await this.juryRepository.findOne({
        where: { id },
        relations: ['title', 'description'],
      });

      const { title, description, imageDeleted, image } = updateJuryDto;
      if (title?.length) {
        await this.textContentService.updateTranslations(jury.title, title);
      }

      if (description?.length) {
        await this.textContentService.updateTranslations(
          jury.description,
          description,
        );
      }
      if (imageDeleted) {
        await this.dmsService.deleteFile(imageDeleted);
      }
      if (image) {
        await this.dmsService.uploadSingleFile({
          file: image,
          entity: 'juries',
          entityId: jury.id,
        });
      }
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number, key: string) {
    try {
      await this.juryRepository.delete(id);
      await this.dmsService.deleteFile(key);
    } catch (error) {
      throw error;
    }
  }
}
