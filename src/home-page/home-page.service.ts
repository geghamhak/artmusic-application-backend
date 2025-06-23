import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateHomePageDto } from './dto/create-home-page.dto';
import { UpdateHomePageDto } from './dto/update-home-page.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TextContentService } from '../translations/text-content.service';
import { HomePage } from './entities/home-page.entity';
import { DmsService } from 'src/dms/dms.service';

@Injectable()
export class HomePageService {
  constructor(
    @InjectRepository(HomePage)
    private homePageRepository: Repository<HomePage>,
    private textContentService: TextContentService,
    private dmsService: DmsService,
  ) {}

  async create(createHomePageDto: CreateHomePageDto) {
    try {
      const homePage = await this.checkIfHomePageExists();
      if (!homePage) {
        const newHomePage = new HomePage();
        const { title, information, videoLink, images } = createHomePageDto;

        newHomePage.title =
          await this.textContentService.addTranslations(title);
        newHomePage.information =
          await this.textContentService.addTranslations(information);

        if (videoLink) {
          newHomePage.videoLink = videoLink;
        }

        if (images) {
          await this.dmsService.uploadMultipleFiles({
            files: images,
            entity: 'homePage',
            entityId: newHomePage.id,
            type: 'images',
          });
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
      .getOne();
    if (!homePage) {
      return {
        title: [
          {
            languageCode: 'en',
            translation: '',
          },
          {
            languageCode: 'am',
            translation: '',
          },
          {
            languageCode: 'ru',
            translation: '',
          },
        ],
        information: [
          {
            languageCode: 'en',
            translation: '',
          },
          {
            languageCode: 'am',
            translation: '',
          },
          {
            languageCode: 'ru',
            translation: '',
          },
        ],
        images: [],
      };
    }
    const title = homePage?.title.translations.map((i) => ({
      languageCode: i.language.code,
      translation: i.translation,
    }));

    const information = homePage?.information.translations.map((i) => ({
      languageCode: i.language.code,
      translation: i.translation,
    }));

    const images = await this.dmsService.getPreSignedUrls(
      `homePage/${homePage.id}/images/`,
    );

    return { title, information, images };
  }

  async update(updateHomePageDto: UpdateHomePageDto) {
    try {
      const homePage = await this.homePageRepository.findOne({
        where: { id: updateHomePageDto.id },
        relations: ['title', 'information'],
      });

      const { title, information, videoLink, images, imagesDeleted } =
        updateHomePageDto;

      if (title) {
        await this.textContentService.updateTranslations(homePage.title, title);
      }

      if (information) {
        await this.textContentService.updateTranslations(
          homePage.information,
          information,
        );
      }

      if (videoLink) {
        homePage.videoLink = videoLink;
      }

      if (imagesDeleted) {
        await this.dmsService.batchDeleteFiles(imagesDeleted);
      }

      if (images) {
        await this.dmsService.uploadMultipleFiles({
          files: images,
          entity: 'homePage',
          entityId: homePage.id,
          type: 'images',
        });
      }
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const homePage = await this.homePageRepository
        .createQueryBuilder('homePage')
        .leftJoinAndSelect('homePage.title', 'titleContent')
        .leftJoinAndSelect('homePage.information', 'informationContent')
        .where('homePage.id = :id', { id })
        .select(['titleContent.id', 'informationContent.id', 'homepage.id'])
        .getOne();

      const { title, information } = homePage;

      await this.textContentService.deleteByIds([title.id, information.id]);
      await this.homePageRepository.delete(id);
      await this.dmsService.batchDeleteFilesByPrefix(`home-page/${id}/`);
    } catch (error) {
      throw error;
    }
  }
}
