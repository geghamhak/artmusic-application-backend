import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateHeaderDto } from './dto/create-header.dto';
import { UpdateHeaderDto } from './dto/update-header.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TextContentService } from '../translations/text-content.service';
import { Header } from './entities/header.entity';
import { DmsService } from 'src/dms/dms.service';

@Injectable()
export class HeaderService {
  constructor(
    @InjectRepository(Header)
    private headerRepository: Repository<Header>,
    private dmsService: DmsService,
    private textContentService: TextContentService,
  ) {}
  async create(createHeaderDto: CreateHeaderDto) {
    try {
      const header = await this.checkIfHeaderExists();
      if (!header) {
        const newHeader = new Header();
        const { bannerTitle, banner, logo } = createHeaderDto;

        newHeader.bannerTitle =
          await this.textContentService.addTranslations(bannerTitle);

        const createdHeader = await this.headerRepository.save(newHeader);

        await this.dmsService.uploadSingleFile({
          file: banner,
          entity: 'header',
          entityId: createdHeader.id,
          type: 'banner',
        });

        await this.dmsService.uploadSingleFile({
          file: logo,
          entity: 'header',
          entityId: createdHeader.id,
          type: 'logo',
        });
      } else {
        throw new BadRequestException(`The header already exists`);
      }
    } catch (error) {
      throw error;
    }
  }

  private async checkIfHeaderExists() {
    const headerCount = await this.headerRepository.count();
    if (headerCount) {
      return new BadRequestException(`The header already exists`);
    }
  }

  async find() {
    const header = await this.headerRepository
      .createQueryBuilder('header')
      .leftJoinAndSelect('header.bannerTitle', 'textContent')
      .leftJoinAndSelect('textContent.translations', 'translations')
      .leftJoinAndSelect('translations.language', 'translationLanguage')
      .select([
        'header.id',
        'textContent.id',
        'translations.translation',
        'translationLanguage.code',
      ])
      .getOne();
    const bannerTitle = header.bannerTitle.translations.map((i) => ({
      languageCode: i.language.code,
      translation: i.translation,
    }));
    const logo = await this.dmsService.getPreSignedUrls(
      `header/${header.id}/logo/`,
    );
    const banner = await this.dmsService.getPreSignedUrls(
      `header/${header.id}/banner/`,
    );

    return { bannerTitle, banner, logo };
  }

  async update(updateHeaderDto: UpdateHeaderDto) {
    try {
      const header = await this.headerRepository.findOne({
        where: { id: updateHeaderDto.id },
        relations: ['bannerTitle'],
      });
      const { bannerTitle, banner, logo, bannerDeleted, logoDeleted } =
        updateHeaderDto;
      if (bannerTitle) {
        await this.textContentService.updateTranslations(
          header.bannerTitle,
          bannerTitle,
        );
      }

      if (bannerDeleted && banner) {
        await this.dmsService.deleteFile(bannerDeleted[0] as unknown as string);
        await this.dmsService.uploadSingleFile({
          file: banner,
          entity: 'header',
          entityId: 1,
          type: 'banner',
        });
      }

      if (logoDeleted && logo) {
        await this.dmsService.deleteFile(logoDeleted[0] as unknown as string);
        await this.dmsService.uploadSingleFile({
          file: logo,
          entity: 'header',
          entityId: 1,
          type: 'logo',
        });
      }
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const header = await this.headerRepository
        .createQueryBuilder('header')
        .leftJoinAndSelect('header.bannerTitle', 'bannerTitle')
        .where('id = :id', { id })
        .select(['bannerTitle.id', 'header.id'])
        .getOne();
      const { bannerTitle } = header;
      await this.textContentService.deleteByIds([bannerTitle.id]);
      await this.headerRepository.delete(id);
      await this.dmsService.batchDeleteFiles([
        `header/${id}/logo/`,
        `header/${id}/banner/`,
      ]);
    } catch (error) {
      throw error;
    }
  }
}
