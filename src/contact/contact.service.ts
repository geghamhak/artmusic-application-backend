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
      const { information } = createContactDto;

      newContact.information = await this.textContentService.addTranslations(
        information,
        languages,
      );

      await this.contactRepository.save(newContact);
    } catch (error) {
      throw error;
    }
  }

  async find() {
    const contactData = await this.contactRepository
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
      .getOne();

    const contacts = {
      contactId: contactData.id,
      information: (contactData.information?.translations || []).map((i) => ({
        languageCode: i.language.code,
        translation: i.translation,
      })),
    };

    return { contacts };
  }

  async update(updateContactDto: UpdateContactDto) {
    try {
      const contact = await this.contactRepository.findOne({
        where: { id: 1 },
        relations: ['information'],
      });
      const { information } = updateContactDto;

      if (information.length > 0) {
        await this.textContentService.updateTranslations(
          contact.information,
          information,
        );
      }
    } catch (error) {
      throw error;
    }
  }
}
