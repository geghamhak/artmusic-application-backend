import { Injectable } from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TextContentService } from '../translations/text-content.service';
import { Staff } from './entities/staff.entity';
import { DmsService } from '../dms/dms.service';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
    private textContentService: TextContentService,
    private dmsService: DmsService,
  ) {}
  async create(createStaffDto: CreateStaffDto) {
    try {
      const newStaffMember = new Staff();
      const { name, description, image } = createStaffDto;

      newStaffMember.name = await this.textContentService.addTranslations(name);
      newStaffMember.description =
        await this.textContentService.addTranslations(description);

      const staffMember = await this.staffRepository.save(newStaffMember);

      await this.dmsService.uploadSingleFile({
        file: image,
        entity: 'staff',
        entityId: staffMember.id,
      });
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    return `This action returns all staff`;
  }

  async update(id: number, updateStaffDto: UpdateStaffDto) {
    try {
      const staffMember = await this.staffRepository.findOneBy({ id });
      const { name, description, image, imageDeleted } = updateStaffDto;
      if (name) {
        await this.textContentService.updateTranslations(
          staffMember.name,
          name,
        );
      }
      if (description) {
        await this.textContentService.updateTranslations(
          staffMember.description,
          description,
        );
      }

      if (imageDeleted && image) {
        await this.dmsService.deleteFile(imageDeleted);
        await this.dmsService.uploadSingleFile({
          file: image,
          entity: 'staff',
          entityId: staffMember.id,
        });
      }
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number, key: string) {
    try {
      await this.staffRepository.delete(id);
      await this.dmsService.deleteFile(key);
    } catch (error) {
      throw error;
    }
  }
}
