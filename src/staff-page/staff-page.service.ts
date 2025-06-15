import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateStaffPageDto } from './dto/create-staff-page.dto';
import { UpdateStaffPageDto } from './dto/update-staff-page.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TextContentService } from '../translations/text-content.service';
import { LanguageService } from '../translations/language.service';
import { StaffPage } from './entities/staff-page.entity';

@Injectable()
export class StaffPageService {
  constructor(
    @InjectRepository(StaffPage)
    private staffPageRepository: Repository<StaffPage>,
    private textContentService: TextContentService,
    private languageService: LanguageService,
  ) {}

  async create(createStaffPageDto: CreateStaffPageDto) {
    try {
      const existingStaffPage = await this.checkIfStaffPageExists();
      if (!existingStaffPage) {
        const staffPage = new StaffPage();
        const languages = await this.languageService.getAllLanguages();
        const { title } = createStaffPageDto;

        staffPage.title = await this.textContentService.addTranslations(
          title,
          languages,
        );

        await this.staffPageRepository.save(staffPage);
      } else {
        throw new BadRequestException(`The staff page already exists`);
      }
    } catch (error) {
      throw error;
    }
  }

  private async checkIfStaffPageExists() {
    const homePageCount = await this.staffPageRepository.count();
    if (homePageCount) {
      return new BadRequestException(`The staff page already exists`);
    }
  }

  async find() {
    const staffPage = await this.staffPageRepository
      .createQueryBuilder('staff_page')
      .leftJoinAndSelect('staff_page.title', 'title')
      .leftJoinAndSelect('title.translations', 'translations')
      .leftJoinAndSelect('translations.language', 'language')
      .select([
        'homepage.id',
        'title.id',
        'translation.translation',
        'language.code',
      ])
      .getOne();

    const title = staffPage?.title.translations.map((translation) => ({
      languageCode: translation.language.code,
      translation: translation.translation,
    }));

    return { title };
  }

  async update(updateStaffPageDto: UpdateStaffPageDto) {
    try {
      const staffPage = await this.staffPageRepository.findOne({
        where: { id: updateStaffPageDto.id },
        relations: ['title'],
      });

      const { title } = updateStaffPageDto;

      if (title) {
        await this.textContentService.updateTranslations(
          staffPage.title,
          title,
        );
      }
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      await this.staffPageRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }
}
