import { Injectable } from '@nestjs/common';
import { DmsService } from '../dms/dms.service';
import {FileSystemStoredFile} from "nestjs-form-data";

@Injectable()
export class FestivalImagesService {
  constructor(
    private dmsService: DmsService,
  ) {}
  async add(
    festivalImagesDto: FileSystemStoredFile[],
    festivalId?: number,
  ): Promise<void> {
    if (!festivalImagesDto.length) {
      return;
    }

    festivalImagesDto.map(async (image: FileSystemStoredFile) => {
      const code = image.originalName;
      await this.dmsService.uploadSingleFile({
        file: image,
        entity: 'festivals',
        entityId: festivalId,
        type: 'gallery',
        code,
      });
    });
  }

  async remove(festivalId, galleryDeleted: string[]) {
    await Promise.all(
      galleryDeleted.map(async (key) => {
        return await this.dmsService.deleteFile(key);
      }),
    );
  }
}
