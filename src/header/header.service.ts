import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateHeaderDto } from './dto/create-header.dto';
import { UpdateHeaderDto } from './dto/update-header.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TextContentService } from '../translations/text-content.service';
import { LanguageService } from '../translations/language.service';
import { Header } from './entities/header.entity';

@Injectable()
export class HeaderService {
  constructor(
    @InjectRepository(Header)
    private headerRepository: Repository<Header>,
    private textContentService: TextContentService,
    private languageService: LanguageService,
  ) {}
  async create(createHeaderDto: CreateHeaderDto) {
    try {
      const header = await this.checkIfHeaderExists();
      if (!header) {
        const newHeader = new Header();
        const languages = await this.languageService.getAllLanguages();
        const { bannerTitle } = createHeaderDto;

        newHeader.bannerTitle = await this.textContentService.addTranslations(
          bannerTitle,
          languages,
        );

        await this.headerRepository.save(newHeader);

        // add images
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
      .getMany();
    const bannerTitle = header[0].bannerTitle.translations.map((i) => ({
      languageCode: i.language.code,
      translation: i.translation,
    }));
    return { bannerTitle };
  }

  async update(updateHeaderDto: UpdateHeaderDto) {
    try {
      const header = await this.headerRepository.findOne({
        where: { id: 1 },
        relations: ['bannerTitle'],
      });
      const { bannerTitle } = updateHeaderDto;
      if (bannerTitle) {
        await this.textContentService.updateTranslations(
          header.bannerTitle,
          bannerTitle,
        );
      }

      // update images
    } catch (error) {
      throw error;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} header`;
  }
}
