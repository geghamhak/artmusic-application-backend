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
      this.checkIfHeaderExists();
      const newHeader = new Header();
      const languages = await this.languageService.getAllLanguages();
      const { bannerTitle } = createHeaderDto;

      newHeader.bannerTitle = await this.textContentService.addTranslations(
        bannerTitle,
        languages,
      );

      await this.headerRepository.save(newHeader);

      // add images
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
      if (bannerTitle) {
        await this.textContentService.updateTranslations(
          header.bannerTitle,
          bannerTitle,
        );
      }

      // update images
    } catch (error) {
      throw new Error(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} header`;
  }
}
