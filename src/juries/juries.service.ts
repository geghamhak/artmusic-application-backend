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
      const { name, description, image } = createJuryDto;
      const newJury = new Jury();
      newJury.name = await this.textContentService.addTranslations(name);
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

  async update(id: number, updateJuryDto: UpdateJuryDto) {
    try {
      const jury = await this.juryRepository.findOne({
        where: { id },
        relations: ['name', 'description'],
      });

      const { name, description, imageDeleted, image } = updateJuryDto;
      if (name?.length) {
        await this.textContentService.updateTranslations(jury.name, name);
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

  async findAll() {
    const juries = await this.juryRepository
      .createQueryBuilder('jury')
      .leftJoinAndSelect('jury.name', 'nameTextContent')
      .leftJoinAndSelect('nameTextContent.translations', 'nameTranslations')
      .leftJoinAndSelect('nameTranslations.language', 'nameLanguage')
      .leftJoinAndSelect('jury.description', 'descriptionTextContent')
      .leftJoinAndSelect(
        'descriptionTextContent.translations',
        'descriptionTranslations',
      )
      .leftJoinAndSelect(
        'descriptionTranslations.language',
        'descriptionLanguage',
      )
      .select([
        'jury.id',
        'nameTextContent.id',
        'descriptionTextContent.id',
        'nameTranslations.translation',
        'descriptionTranslations.translation',
        'nameLanguage.code',
        'descriptionLanguage.code',
      ])
      .getMany();

    if (juries && !juries.length) {
      return [];
    }

    const images = await this.dmsService.getPreSignedUrls('juries/');

    return juries.map((jury) => {
      return {
        id: jury.id,
        image: images.find((image) => image.key.includes(`juries/${jury.id}`)),
        name: {
          translations: jury.name.translations.map((translation) => ({
            languageCode: translation.language.code,
            translation: translation.translation,
          })),
        },
        description: {
          translations: jury.description.translations.map((translation) => ({
            languageCode: translation.language.code,
            translation: translation.translation,
          })),
        },
      };
    });
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
