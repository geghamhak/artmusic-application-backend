import { Injectable, Logger } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';
import { Repository } from 'typeorm';
import { TextContentService } from 'src/translations/text-content.service';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
    private textContentService: TextContentService,
  ) {}

  async create(createContactDto: CreateContactDto) {
    try {
      const newContact = new Contact();
      const { information } = createContactDto;
      newContact.information =
        await this.textContentService.addTranslations(information);

      newContact.location = createContactDto.location;
      await this.contactRepository.save(newContact);
    } catch (error) {
      throw error;
    }
  }

  async find() {
    try {
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

      if (!contactData) {
        return {
          contacts: {},
        };
      }

      const contacts = {
        contactId: contactData.id,
        information: (contactData.information?.translations || []).map((i) => ({
          languageCode: i.language.code,
          translation: i.translation,
        })),
      };

      return { contacts };
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  async update(updateContactDto: UpdateContactDto) {
    try {
      const contact = await this.contactRepository.findOne({
        where: { id: updateContactDto.id },
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

  async remove(id: number) {
    try {
      const contact = await this.contactRepository
        .createQueryBuilder()
        .leftJoinAndSelect('contact.information', 'information')
        .where('id = :id', { id })
        .select(['contact.id', 'information.id'])
        .getOne();

      const { information } = contact;
      await this.textContentService.deleteByIds([information.id]);
      await this.contactRepository.delete(contact.id);
    } catch (error) {
      throw error;
    }
  }
}
