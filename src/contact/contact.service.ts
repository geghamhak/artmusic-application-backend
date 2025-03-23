import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';
import { Repository } from 'typeorm';
import { TextContentService } from 'src/translations/text-content.service';
import { LanguageService } from 'src/translations/language.service';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
    private textContentService: TextContentService,
    private languageService: LanguageService,
  ) {}

  async create(createContactDto: CreateContactDto) {
    try {
      const contact = await this.checkIfContactExists();
      if (!contact) {
        const newContact = new Contact();
        const languages = await this.languageService.getAllLanguages();
        const { images, information } = createContactDto;

        newContact.information = await this.textContentService.addTranslations(
          information,
          languages,
        );

        await this.contactRepository.save(newContact);
      } else {
        throw new BadRequestException(`The contact already exists`);
      }
    } catch (error) {
      throw error;
    }
  }

  private async checkIfContactExists() {
    const contactCount = await this.contactRepository.count();
    if (contactCount) {
      return new BadRequestException(`The contact already exists`);
    }
  }

  async findAll() {
    const contact = await this.contactRepository
      .createQueryBuilder('contact')
      .leftJoinAndSelect('contact.information', 'textContent')
      .leftJoinAndSelect('textContent.translations', 'translations')
      .leftJoinAndSelect('translations.language', 'translationLanguage')
      .select([
        'contact.id',
        'textContent.id',
        'translations.translation',
        'translationLanguage.code',
      ])
      .getMany();
    const information = contact[0].information.translations.map((i) => ({
      languageCode: i.language.code,
      translation: i.translation,
    }));
    return { information };
  }

  async update(updateContactDto: UpdateContactDto) {
    try {
      const contact = await this.contactRepository.findOne({});
      const { images, information } = updateContactDto;

      if (information.length > 0) {
        await this.textContentService.updateTranslations(
          contact.information,
          information,
        );
      }

      // update images
    } catch (error) {
      throw error;
    }
  }
}
