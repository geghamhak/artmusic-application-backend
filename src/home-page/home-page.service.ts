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
      const homePage = await this.checkIfHomePageExists();
      if (!homePage) {
        const newHomePage = new HomePage();
        const languages = await this.languageService.getAllLanguages();
        const { title, information, videoLink } = createHomePageDto;

        newHomePage.title = await this.textContentService.addTranslations(
          title,
          languages,
        );
        newHomePage.information = await this.textContentService.addTranslations(
          information,
          languages,
        );

        if (videoLink) {
          newHomePage.videoLink = videoLink;
        }

        await this.homePageRepository.save(newHomePage);
      } else {
        throw new BadRequestException(`The home page already exists`);
      }
    } catch (error) {
      throw error;
    }
  }

  private async checkIfHomePageExists() {
    const homePageCount = await this.homePageRepository.count();
    if (homePageCount) {
      return new BadRequestException(`The homepage already exists`);
    }
  }

  async find() {
    const homePage = await this.homePageRepository
      .createQueryBuilder('homepage')
      .leftJoinAndSelect('homepage.title', 'titleContent')
      .leftJoinAndSelect('titleContent.translations', 'titleTranslations')
      .leftJoinAndSelect('titleTranslations.language', 'titleLanguage')
      .leftJoinAndSelect('homepage.information', 'infoContent')
      .leftJoinAndSelect('infoContent.translations', 'infoTranslations')
      .leftJoinAndSelect('infoTranslations.language', 'infoLanguage')
      .select([
        'homepage.id',
        'titleContent.id',
        'titleTranslations.translation',
        'titleLanguage.code',
        'infoContent.id',
        'infoTranslations.translation',
        'infoLanguage.code',
      ])
      .getMany();

    const title = homePage[0]?.title.translations.map((i) => ({
      languageCode: i.language.code,
      translation: i.translation,
    }));

    const information = homePage[0]?.information.translations.map((i) => ({
      languageCode: i.language.code,
      translation: i.translation,
    }));

    return { title, information };
  }

  async update(updateHomePageDto: UpdateHomePageDto) {
    try {
      const homePage = await this.homePageRepository.findOne({
        where: { id: 1 },
        relations: ['title', 'information'],
      });

      const { title, information, videoLink } = updateHomePageDto;

      if (title.length > 0) {
        await this.textContentService.updateTranslations(homePage.title, title);
      }

      if (information.length > 0) {
        await this.textContentService.updateTranslations(
          homePage.information,
          information,
        );
      }

      if (videoLink) {
        homePage.videoLink = videoLink;
      }

      // update images
    } catch (error) {
      throw error;
    }
  }
}
