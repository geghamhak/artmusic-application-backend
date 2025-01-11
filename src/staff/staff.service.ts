import { Injectable } from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TextContentService } from '../translations/text-content.service';
import { LanguageService } from '../translations/language.service';
import { Staff } from './entities/staff.entity';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
    private textContentService: TextContentService,
    private languageService: LanguageService,
  ) {}
  async create(createStaffDto: CreateStaffDto) {
    try {
      const newStaff = new Staff();
      const languages = await this.languageService.getAllLanguages();
      const { name, role } = createStaffDto;

      newStaff.name = await this.textContentService.addTranslations(
        name.translations,
        languages,
      );
      newStaff.role = await this.textContentService.addTranslations(
        role.translations,
        languages,
      );

      await this.staffRepository.save(newStaff);

      // add images logic
    } catch (error) {
      throw new Error(error);
    }
  }

  findAll() {
    return `This action returns all staff`;
  }

  findOne(id: number) {
    return `This action returns a #${id} staff`;
  }

  async update(id: number, updateStaffDto: UpdateStaffDto) {
    try {
      const staff = await this.staffRepository.findOneBy({ id });
      const { name, role } = updateStaffDto;
      if (name) {
        await this.textContentService.updateTranslations(
          staff.name,
          name.translations,
        );
      }
      if (role) {
        await this.textContentService.updateTranslations(
          staff.role,
          role.translations,
        );
      }

      // update images
    } catch (error) {
      throw new Error(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} staff`;
  }
}
