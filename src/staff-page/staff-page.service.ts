import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateStaffPageDto } from './dto/create-staff-page.dto';
import { UpdateStaffPageDto } from './dto/update-staff-page.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TextContentService } from '../translations/text-content.service';
import { StaffPage } from './entities/staff-page.entity';

@Injectable()
export class StaffPageService {
  constructor(
    @InjectRepository(StaffPage)
    private staffPageRepository: Repository<StaffPage>,
    private textContentService: TextContentService,
  ) {}

  async create(createStaffPageDto: CreateStaffPageDto) {
    try {
      const existingStaffPage = await this.checkIfStaffPageExists();
      if (!existingStaffPage) {
        const staffPage = new StaffPage();
        const { title } = createStaffPageDto;

        staffPage.title = await this.textContentService.addTranslations(title);

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
    try {
      const staffPage = await this.staffPageRepository
        .createQueryBuilder('staffPage')
        .leftJoinAndSelect('staffPage.title', 'title')
        .leftJoinAndSelect('title.translations', 'translations')
        .leftJoinAndSelect('translations.language', 'language')
        .select([
          'staffPage.id',
          'title.id',
          'translations.translation',
          'language.code',
        ])
        .getOne();

      if (!staffPage) {
        return null;
      }

      const title = staffPage?.title.translations.map((translation) => ({
        languageCode: translation.language.code,
        translation: translation.translation,
      }));

      return { title };
    } catch (error) {
      Logger.error(error);
      throw error;
    }
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
      const staffPage = await this.staffPageRepository
        .createQueryBuilder('staffPage')
        .leftJoinAndSelect('staffPage.title', 'title')
        .where('staffPage.id = :id', { id })
        .select(['title.id', 'staffPage.id'])
        .getOne();
      const { title } = staffPage;
      await this.textContentService.deleteByIds([title.id]);
      await this.staffPageRepository.delete(id);
    } catch (error) {
      throw error;
    }
  }
}
