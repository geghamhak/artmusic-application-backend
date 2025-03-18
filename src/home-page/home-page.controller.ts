import { Controller, Get, Post, Body, Patch } from '@nestjs/common';
import { HomePageService } from './home-page.service';
import { CreateHomePageDto } from './dto/create-home-page.dto';
import { UpdateHomePageDto } from './dto/update-home-page.dto';
import { FileSystemStoredFile, FormDataRequest } from 'nestjs-form-data';

@Controller('home-page')
export class HomePageController {
  constructor(private readonly homePageService: HomePageService) {}

  @Post()
  @FormDataRequest({ storage: FileSystemStoredFile })
  create(@Body() createHomePageDto: CreateHomePageDto) {
    return this.homePageService.create(createHomePageDto);
  }

  @Get()
  findOne() {
    return this.homePageService.find();
  }

  @Patch()
  update(@Body() updateHomePageDto: UpdateHomePageDto) {
    return this.homePageService.update(updateHomePageDto);
  }
}
