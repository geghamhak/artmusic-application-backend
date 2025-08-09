import { Module } from '@nestjs/common';
import { FestivalConfigService } from './festival-config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FestivalConfig } from './entities/festival-config.entity';
import { FestivalTypesModule } from '../festival-types/festival-types.module';

@Module({
  imports: [TypeOrmModule.forFeature([FestivalConfig]), FestivalTypesModule],
  providers: [FestivalConfigService],
  exports: [FestivalConfigService],
})
export class FestivalConfigModule {}
