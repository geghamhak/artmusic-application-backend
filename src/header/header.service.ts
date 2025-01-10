import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateHeaderDto } from './dto/create-header.dto';
import { UpdateHeaderDto } from './dto/update-header.dto';
import { Staff } from '../staff/entities/staff.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TextContentService } from '../translations/text-content.service';
import { LanguageService } from '../translations/language.service';
import { Head } from 'rxjs';
import { Header } from './entities/header.entity';
import { TranslationsService } from '../translations/translations.service';

@Injectable()
export class HeaderService {
  constructor(
    @InjectRepository(Header)
    private headerRepository: Repository<Header>,
    private textContentService: TextContentService,
    private languageService: LanguageService,
    private translationService: TranslationsService,
  ) {}
  async create(createHeaderDto: CreateHeaderDto) {
    try {
      this.checkIfHeaderExists();
      const newHeader = new Header();
      const languages = await this.languageService.getAllLanguages();
      const { bannerTitle } = createHeaderDto;

      newHeader.bannerTitle = await this.textContentService.addTranslations(
        bannerTitle.translations,
        languages,
      );

      await this.headerRepository.save(newHeader);
    } catch (error) {
      throw new Error(error);
    }
  }

  private checkIfHeaderExists() {
    const header = this.headerRepository.findOne({});
    if (header) {
      return new BadRequestException(`The header already exists`);
    }
  }

  find() {
    return this.headerRepository.findOne({});
  }

  async update(updateHeaderDto: UpdateHeaderDto) {
    try {
      const header = await this.headerRepository.findOne({});
      const { bannerTitle } = updateHeaderDto;
      await this.textContentService.updateTranslations(
        header.bannerTitle,
        bannerTitle.translations,
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} header`;
  }
}
