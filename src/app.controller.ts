import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {CountriesService} from "./countries/countries.service";
import {Country} from "./countries/entities/country.entity";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly countryService: CountriesService) {}

  @Get()
  async getHello(): Promise<Country[]> {
    try {
      return await this.countryService.findAll();
    } catch (e) {
      throw e;
    }
  }
}
