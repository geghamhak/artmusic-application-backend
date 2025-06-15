import { Controller, Get, Post, Body, Patch } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { FileSystemStoredFile, FormDataRequest } from 'nestjs-form-data';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @FormDataRequest({ storage: FileSystemStoredFile })
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactService.create(createContactDto);
  }

  @Get()
  find() {
    return this.contactService.find();
  }

  @Patch()
  @FormDataRequest({ storage: FileSystemStoredFile })
  update(@Body() updateContactDto: UpdateContactDto) {
    return this.contactService.update(updateContactDto);
  }
}
