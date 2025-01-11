import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateHomePageDto } from './dto/create-home-page.dto';
import { UpdateHomePageDto } from './dto/update-home-page.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TextContentService } from '../translations/text-content.service';
import { LanguageService } from '../translations/language.service';
import { HomePage } from './entities/home-page.entity';

@Injectable()
export class HomePageService {
  constructor(
    @InjectRepository(HomePage)
    private homePageRepository: Repository<HomePage>,
    private textContentService: TextContentService,
    private languageService: LanguageService,
  ) {}

  async create(createHomePageDto: CreateHomePageDto) {
    try {
      this.checkIfHomePageExists();
      const newHomePage = new HomePage();
      const languages = await this.languageService.getAllLanguages();
      const { title, information, videoLink } = createHomePageDto;

      newHomePage.title = await this.textContentService.addTranslations(
        title.translations,
        languages,
      );
      newHomePage.information = await this.textContentService.addTranslations(
        information.translations,
        languages,
      );

      if (videoLink) {
        newHomePage.videoLink = videoLink;
      }

      await this.homePageRepository.save(newHomePage);
    } catch (error) {
      throw new Error(error);
    }
  }

  private checkIfHomePageExists() {
    const homePage = this.homePageRepository.findOne({});
    if (homePage) {
      return new BadRequestException(`The homepage already exists`);
    }
  }

  find() {
    return this.homePageRepository.findOne({});
  }

  async update(updateHomePageDto: UpdateHomePageDto) {
    try {
      const homePage = await this.homePageRepository.findOne({});
      const { title, information, videoLink } = updateHomePageDto;

      if (title.translations.length > 0) {
        await this.textContentService.updateTranslations(
          homePage.title,
          title.translations,
        );
      }

      if (information.translations.length > 0) {
        await this.textContentService.updateTranslations(
          homePage.information,
          information.translations,
        );
      }

      if (videoLink) {
        homePage.videoLink = videoLink;
      }

      // update images
    } catch (error) {
      throw new Error(error);
    }
  }
}
