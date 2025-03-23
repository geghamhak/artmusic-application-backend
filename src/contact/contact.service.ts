import { Injectable } from '@nestjs/common';
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
      const newContact = new Contact();
      const languages = await this.languageService.getAllLanguages();
      const { images, information } = createContactDto;

      newContact.information = await this.textContentService.addTranslations(
        information,
        languages,
      );

      await this.contactRepository.save(newContact);
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    const contactsData = await this.contactRepository
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

    const contacts = contactsData.map((contact) => ({
      contactId: contact.id,
      translations: (contact.information?.translations || []).map((i) => ({
        languageCode: i.language.code,
        translation: i.translation,
      })),
    }));

    return { contacts };
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
