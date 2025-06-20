import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateFestivalImageDto } from './dto/create-festival-image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DmsService } from '../dms/dms.service';
import { TextContentService } from '../translations/text-content.service';
import { FestivalImage } from './entities/festival-image.entity';
import { ApplicationsService } from '../applications/applications.service';
import { SubNomination } from '../sub-nominations/entities/sub-nomination.entity';

@Injectable()
export class FestivalImagesService {
  constructor(
    @InjectRepository(FestivalImage)
    private festivalImageRepository: Repository<FestivalImage>,
    private dmsService: DmsService,
    private textContentService: TextContentService,
    @Inject(forwardRef(() => ApplicationsService))
    private applicationService: ApplicationsService,
  ) {}
  async add(
    festivalImagesDto: CreateFestivalImageDto[],
    festivalId?: number,
  ): Promise<void> {
    if (!festivalImagesDto.length) {
      return;
    }
    festivalImagesDto.map(async (festivalImageDto: CreateFestivalImageDto) => {
      const { title, image, subNominationId } = festivalImageDto;
      const code = image.originalName;
      const newFestivalImage = new FestivalImage();
      const correctSubNominationId = await this.getFestivalImageSubNomination(
        festivalId,
        code,
        subNominationId,
      );
      newFestivalImage.subNomination = {
        id: correctSubNominationId,
      } as SubNomination;

      if (title) {
        newFestivalImage.title =
          await this.textContentService.addTranslations(title);
      }
      await this.festivalImageRepository.save(newFestivalImage);
      await this.dmsService.uploadSingleFile({
        file: image,
        entity: 'festivals',
        entityId: festivalId,
        type: 'gallery',
        code,
      });
    });
  }

  async getFestivalImageSubNomination(
    festivalId: number,
    code: string,
    subNominationId: string,
  ) {
    const application = await this.applicationService.getByFestivalIdAndCode(
      festivalId,
      code,
    );
    return application ? application.subNomination.id : subNominationId;
  }

  async remove(festivalId: number, galleryDeleted: string[]) {
    // codes from strings
    const codes = galleryDeleted.map((deletedKey) => {
      const str = deletedKey.split('/');
      return str[str.length - 1].split('.')[0];
    });
    await this.festivalImageRepository
      .createQueryBuilder('festivalImage')
      .delete()
      .from('festivalImage')
      .where('festivalImage.festivalId = :festivalId', { festivalId })
      .andWhere('festivalImage.code IN (:...codes)', { codes })
      .execute();

    await Promise.all(
      galleryDeleted.map(async (key) => {
        return await this.dmsService.deleteFile(key);
      }),
    );
  }
}
