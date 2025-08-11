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
      const { name, description, image, isActive } = createStaffDto;

      newStaffMember.name = await this.textContentService.addTranslations(name);
      newStaffMember.description =
        await this.textContentService.addTranslations(description);
      newStaffMember.isActive = !!isActive;

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

  async findAll() {
    const staff = await this.staffRepository
      .createQueryBuilder('staff')
      .leftJoinAndSelect('staff.name', 'nameTextContent')
      .leftJoinAndSelect('nameTextContent.translations', 'nameTranslations')
      .leftJoinAndSelect('nameTranslations.language', 'nameLanguage')
      .leftJoinAndSelect('staff.description', 'descriptionTextContent')
      .leftJoinAndSelect(
        'descriptionTextContent.translations',
        'descriptionTranslations',
      )
      .leftJoinAndSelect(
        'descriptionTranslations.language',
        'descriptionLanguage',
      )
      .select([
        'staff.id',
        'nameTextContent.id',
        'descriptionTextContent.id',
        'nameTranslations.translation',
        'descriptionTranslations.translation',
        'nameLanguage.code',
        'descriptionLanguage.code',
      ])
      .getMany();

    if (staff && !staff.length) {
      return {};
    }

    const images = await this.dmsService.getPreSignedUrls('staff/');

    return staff.map((staffMember) => {
      return {
        id: staffMember.id,
        image: images.find((image) =>
          image.key.includes(`staff/${staffMember.id}/`),
        ),
        name: {
          translations: staffMember.name.translations.map((translation) => ({
            languageCode: translation.language.code,
            translation: translation.translation,
          })),
        },
        description: {
          translations: staffMember.description.translations.map(
            (translation) => ({
              languageCode: translation.language.code,
              translation: translation.translation,
            }),
          ),
        },
      };
    });
  }

  async update(id: number, updateStaffDto: UpdateStaffDto) {
    try {
      const staffMember = await this.staffRepository.findOneBy({ id });
      const { name, description, image, imageDeleted, isActive } =
        updateStaffDto;
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

      if (isActive) {
        staffMember.isActive = !!isActive;
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
